"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../contexts/AuthContext";
import { authService } from "../../../services/auth.service";

const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, isAuthenticated, authReady } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    let ignore = false;

    if (!authReady) {
      return () => {
        ignore = true;
      };
    }

    if (!isAuthenticated) {
      router.push("/login");
    } else {
      // Fetch fresh user data from backend
      authService.whoami().then((freshUser) => {
        if (ignore) return;
        updateUser(freshUser);
        reset({
          username: freshUser.username,
          email: freshUser.email,
          gender: freshUser.gender as "male" | "female" | "other",
        });
        if (freshUser.profileImage) {
          setPreviewImage(freshUser.profileImage);
        }
      }).catch((err) => {
        if (ignore) return;
        console.error("Failed to fetch user data:", err);
        // Fallback to cached data
        if (user) {
          reset({
            username: user.username,
            email: user.email,
            gender: user.gender as "male" | "female" | "other",
          });
          if (user.profileImage) {
            setPreviewImage(user.profileImage);
          }
        }
      });
    }

    return () => {
      ignore = true;
    };
  }, [authReady, isAuthenticated, router, reset, updateUser]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await authService.uploadImage(file);
      setPreviewImage(result.imageUrl);
      showToast("success", "Image uploaded successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed";
      showToast("error", message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const updateData: {
        username?: string;
        email?: string;
        gender?: "male" | "female" | "other";
        profileImage?: string;
      } = {};
      if (data.username) updateData.username = data.username.trim();
      if (data.email) updateData.email = data.email.trim().toLowerCase();
      if (data.gender) updateData.gender = data.gender;
      if (previewImage) updateData.profileImage = previewImage;

      await authService.updateProfile(updateData);
      const result = await authService.whoami();
      
      updateUser(result);
      reset({
        username: result.username,
        email: result.email,
        gender: result.gender as "male" | "female" | "other",
      });
      setPreviewImage(result.profileImage || null);
      showToast("success", "Profile updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Profile update failed";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  if (!authReady || !isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-root">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.message}
        </div>
      )}

      <header className="nav">
        <div className="logo">Medi<span>Mate</span></div>
        <button onClick={() => router.push("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <h1>Update Profile</h1>
          <p className="form-sub">Manage your account information and profile picture.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            <div className="image-upload-section">
              <div className="image-preview">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="profile-image" />
                ) : (
                  <div className="placeholder-image">👤</div>
                )}
              </div>
              <div className="upload-controls">
                <label htmlFor="image-upload" className="upload-btn">
                  {uploading ? "Uploading..." : "Upload Image"}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden-input"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                {...registerField("username")}
                type="text"
                placeholder="Enter your username"
              />
              {errors.username && <span className="error-text">{errors.username.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                {...registerField("email")}
                type="email"
                placeholder="name@example.com"
              />
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" {...registerField("gender")}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender.message}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading || uploading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>

      <style jsx>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .profile-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #f1f5f9;
          color: #1e293b;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 3rem;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
        }

        .logo {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .logo span { color: #2563eb; }

        .back-btn {
          padding: 0.5rem 1.25rem;
          background: #fff;
          color: #2563eb;
          border: 1.5px solid #2563eb;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .back-btn:hover { background: #f0f9ff; }

        .profile-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .profile-card {
          width: 100%;
          max-width: 500px;
          background: #fff;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .profile-card h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
          letter-spacing: -0.3px;
        }

        .form-sub {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .profile-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .image-upload-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .image-preview {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          font-size: 3rem;
          color: #94a3b8;
        }

        .upload-controls { display: flex; gap: 0.5rem; }

        .upload-btn {
          padding: 0.5rem 1rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .upload-btn:hover { background: #1d4ed8; }
        .upload-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .hidden-input { display: none; }

        .field { display: flex; flex-direction: column; gap: 0.5rem; }

        .field label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
        }

        .field input,
        .field select {
          padding: 0.75rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #1e293b;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          width: 100%;
        }

        .field input:focus,
        .field select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .field input::placeholder { color: #94a3b8; }

        .error-text {
          font-size: 0.75rem;
          color: #ef4444;
        }

        .submit-btn {
          margin-top: 0.5rem;
          padding: 0.8rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover { background: #1d4ed8; }
        .submit-btn:disabled { opacity: 0.8; cursor: not-allowed; }

        .toast {
          position: fixed;
          top: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          animation: slideDown 0.3s ease;
        }

        .toast-success { background: #fff; border: 1.5px solid #22c55e; color: #15803d; }
        .toast-error { background: #fff; border: 1.5px solid #ef4444; color: #b91c1c; }

        @keyframes slideDown {
          from { opacity: 0; top: 0.5rem; }
          to { opacity: 1; top: 1.25rem; }
        }

        @media (max-width: 768px) {
          .nav { padding: 1rem 1.5rem; }
          .profile-card { padding: 2rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}
