"use client";

import React, { createContext, useContext, useCallback, useMemo, useSyncExternalStore } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  gender: string;
  profileImage?: string;
  role?: "user" | "admin";
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  authReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthSnapshot = {
  user: User | null;
  token: string | null;
  authReady: boolean;
};

const serverSnapshot: AuthSnapshot = {
  user: null,
  token: null,
  authReady: false,
};

let currentSnapshot = serverSnapshot;
const listeners = new Set<() => void>();

const readStoredAuth = (): AuthSnapshot => {
  if (typeof window === "undefined") {
    return serverSnapshot;
  }

  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!storedToken || !storedUser) {
    return { user: null, token: null, authReady: true };
  }

  try {
    return {
      user: JSON.parse(storedUser) as User,
      token: storedToken,
      authReady: true,
    };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null, authReady: true };
  }
};

const sameSnapshot = (left: AuthSnapshot, right: AuthSnapshot) =>
  left.token === right.token &&
  left.authReady === right.authReady &&
  JSON.stringify(left.user) === JSON.stringify(right.user);

const getClientSnapshot = () => {
  const nextSnapshot = readStoredAuth();
  if (!sameSnapshot(currentSnapshot, nextSnapshot)) {
    currentSnapshot = nextSnapshot;
  }
  return currentSnapshot;
};

const subscribeToAuth = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const notifyAuthChanged = () => {
  currentSnapshot = readStoredAuth();
  listeners.forEach((listener) => listener());
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, authReady } = useSyncExternalStore(
    subscribeToAuth,
    getClientSnapshot,
    () => serverSnapshot
  );

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    notifyAuthChanged();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    notifyAuthChanged();
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    notifyAuthChanged();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      updateUser,
      isAuthenticated: !!token,
      authReady,
    }),
    [user, token, login, logout, updateUser, authReady]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
