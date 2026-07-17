"use server";

import { authService } from "../services/auth.service";
import { RegisterFormData, LoginFormData } from "../schemas/auth.schema";
import { cookies } from "next/headers";

export async function registerAction(data: RegisterFormData) {
  try {
    const result = await authService.register(data);
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Registration failed" 
    };
  }
}

export async function loginAction(data: LoginFormData) {
  try {
    const result = await authService.login(data);
    
    // Set token in cookie
    const cookieStore = await cookies();
    cookieStore.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Login failed" 
    };
  }
}
