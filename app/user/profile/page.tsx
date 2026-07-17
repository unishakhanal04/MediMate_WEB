"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { profileService } from "../../../services/profile.service";
import { authService } from "../../../services/auth.service";
import { emergencyContactService, EmergencyContact } from "../../../services/emergency-contact.service";
import {
  emergencyContactSchema,
  type EmergencyContactFormData,
} from "../../../schemas/emergency-contact.schema";
import { ProfileData, UserPreferences } from "../../../types/profile.types";
import {
  PersonalInfoFormData,
  MedicalInfoFormData,
  PasswordFormData,
} from "../../../schemas/profile.schema";
import { PageHeader } from "../../../components/common/PageHeader";
import { ProfileCard } from "../../../components/profile/ProfileCard";
import { ProfileCompletion } from "../../../components/profile/ProfileCompletion";
import { PersonalInfoForm } from "../../../components/profile/PersonalInfoForm";
import { MedicalInfoForm } from "../../../components/profile/MedicalInfoForm";
import { PreferencesForm } from "../../../components/profile/PreferencesForm";
import { PasswordForm } from "../../../components/profile/PasswordForm";
import { ProfileSkeleton } from "../../../components/profile/ProfileSkeleton";
import { Card } from "../../../components/dashboard/Card";
import { Modal } from "../../../components/Modal";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, updateUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingMedical, setSavingMedical] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [savingContact, setSavingContact] = useState(false);

  const {
    register: registerContactField,
    handleSubmit: handleContactSubmit,
    formState: { errors: contactErrors },
    reset: resetContactForm,
  } = useForm<EmergencyContactFormData>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: { name: "", relationship: "", phone: "", email: "", isPrimary: false },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchProfile();
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Unable to load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const data = await emergencyContactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch emergency contacts:", error);
      toast.error("Unable to load emergency contacts.");
    } finally {
      setContactsLoading(false);
    }
  };

  const handlePersonalSubmit = async (data: PersonalInfoFormData) => {
    setSavingPersonal(true);
    try {
      const updated = await profileService.updateProfile(data);
      setProfile(updated);
      const freshUser = await authService.whoami();
      updateUser(freshUser);
      toast.success("Personal information updated successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update personal information.";
      toast.error(message);
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleMedicalSubmit = async (data: MedicalInfoFormData) => {
    setSavingMedical(true);
    try {
      const updated = await profileService.updateProfile({
        bloodGroup: data.bloodGroup || undefined,
        allergies: data.allergies
          ? data.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        chronicDiseases: data.chronicDiseases
          ? data.chronicDiseases.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        height: data.height ? Number(data.height) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
      });
      setProfile(updated);
      toast.success("Medical information updated successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update medical information.";
      toast.error(message);
    } finally {
      setSavingMedical(false);
    }
  };

  const handlePreferencesSubmit = async (data: UserPreferences) => {
    setSavingPreferences(true);
    try {
      const updated = await profileService.updatePreferences(data);
      setProfile(updated);
      toast.success("Preferences updated successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update preferences.";
      toast.error(message);
    } finally {
      setSavingPreferences(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setSavingPassword(true);
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
      setSavingPassword(false);
    }
  };

  const openAddContactModal = () => {
    setEditingContact(null);
    resetContactForm({ name: "", relationship: "", phone: "", email: "", isPrimary: false });
    setShowContactModal(true);
  };

  const openEditContactModal = (contact: EmergencyContact) => {
    setEditingContact(contact);
    resetContactForm({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email ?? "",
      isPrimary: contact.isPrimary,
    });
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setEditingContact(null);
  };

  const onContactSubmit = async (data: EmergencyContactFormData) => {
    setSavingContact(true);
    try {
      const payload = { ...data, email: data.email || undefined };
      if (editingContact) {
        const updated = await emergencyContactService.update(editingContact._id, payload);
        setContacts((current) => current.map((item) => (item._id === updated._id ? updated : item)));
        toast.success("Emergency contact updated.");
      } else {
        const created = await emergencyContactService.create(payload);
        setContacts((current) => [...current, created]);
        toast.success("Emergency contact added.");
      }
      closeContactModal();
    } catch (error) {
      console.error("Failed to save emergency contact:", error);
      toast.error("Unable to save emergency contact. Please try again.");
    } finally {
      setSavingContact(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this emergency contact?")) return;

    try {
      await emergencyContactService.remove(id);
      setContacts((current) => current.filter((item) => item._id !== id));
      toast.success("Emergency contact deleted.");
    } catch (error) {
      console.error("Failed to delete emergency contact:", error);
      toast.error("Unable to delete emergency contact. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <PageHeader
        icon="👤"
        title="My Profile"
        description="Manage your personal, medical, and account information."
      />

      {loading || !profile ? (
        <ProfileSkeleton />
      ) : (
        <div className="flex flex-col gap-6">
          <ProfileCard profile={profile} />
          <ProfileCompletion profile={profile} />

          <PersonalInfoForm profile={profile} onSubmit={handlePersonalSubmit} submitting={savingPersonal} />
          <MedicalInfoForm profile={profile} onSubmit={handleMedicalSubmit} submitting={savingMedical} />

          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Emergency Contacts</h2>
                <p className="text-sm text-gray-500">People we can reach in case of an emergency.</p>
              </div>
              <button
                onClick={openAddContactModal}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
              >
                + Add Contact
              </button>
            </div>

            {contactsLoading ? (
              <p className="text-sm text-gray-400">Loading contacts...</p>
            ) : contacts.length === 0 ? (
              <p className="text-sm text-gray-400">No emergency contacts added yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <div key={contact._id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{contact.name}</span>
                        {contact.isPrimary && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {contact.relationship} · {contact.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditContactModal(contact)}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact._id)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <PreferencesForm
            preferences={profile.preferences}
            onSubmit={handlePreferencesSubmit}
            submitting={savingPreferences}
          />
          <PasswordForm onSubmit={handlePasswordSubmit} submitting={savingPassword} />
        </div>
      )}

      <Modal
        open={showContactModal}
        title={editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
        onClose={closeContactModal}
      >
        <form onSubmit={handleContactSubmit(onContactSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name *</label>
            <input
              type="text"
              placeholder="e.g., Jane Doe"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
              {...registerContactField("name")}
            />
            {contactErrors.name && <p className="mt-1 text-xs text-red-600">{contactErrors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Relationship *</label>
            <input
              type="text"
              placeholder="e.g., Spouse"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
              {...registerContactField("relationship")}
            />
            {contactErrors.relationship && (
              <p className="mt-1 text-xs text-red-600">{contactErrors.relationship.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Phone Number *</label>
            <input
              type="tel"
              placeholder="e.g., +1 555 123 4567"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
              {...registerContactField("phone")}
            />
            {contactErrors.phone && <p className="mt-1 text-xs text-red-600">{contactErrors.phone.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Email (Optional)</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
              {...registerContactField("email")}
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              {...registerContactField("isPrimary")}
            />
            Set as primary contact
          </label>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={closeContactModal}
              className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingContact}
              className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {savingContact ? "Saving..." : editingContact ? "Update Contact" : "Add Contact"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
