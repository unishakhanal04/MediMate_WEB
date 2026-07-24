"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { authService } from "../../../services/auth.service";
import { profileService } from "../../../services/profile.service";
import { PasswordFormData } from "../../../schemas/profile.schema";
import { PageHeader } from "../../../components/common/PageHeader";
import { PasswordForm } from "../../../components/profile/PasswordForm";

export default function PasswordPage() {
  const router = useRouter();
  const { isAuthenticated, authReady } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    authService
      .whoami()
      .then((freshUser) => {
        if (freshUser.role === "admin") {
          router.replace("/admin");
        }
      })
      .catch(() => {
        // ignore
      });
  }, [authReady, isAuthenticated, router]);

  const handleSubmit = async (data: PasswordFormData) => {
    setSubmitting(true);
    try {
      await profileService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update password.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!authReady || !isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader icon="🔒" title="Change Password" description="Update your password to keep your account secure." />
      <PasswordForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
