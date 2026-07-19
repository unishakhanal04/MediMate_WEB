"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { prescriptionService } from "../../../services/prescription.service";
import {
  Prescription,
  PrescriptionFilterParams,
  getPrescriptionDisplayStatus,
} from "../../../types/prescription.types";
import { PrescriptionFormData } from "../../../schemas/prescription.schema";
import { PrescriptionList } from "../../../components/prescriptions/PrescriptionList";
import { PastPrescriptionsTable } from "../../../components/prescriptions/PastPrescriptionsTable";
import { PrescriptionEmptyState } from "../../../components/prescriptions/PrescriptionEmptyState";
import { PrescriptionSkeleton } from "../../../components/prescriptions/PrescriptionSkeleton";
import { PrescriptionFilters } from "../../../components/prescriptions/PrescriptionFilters";
import { PrescriptionForm } from "../../../components/prescriptions/PrescriptionForm";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";

export default function PrescriptionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState<PrescriptionFilterParams>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchPrescriptions();
    }
  }, [isAuthenticated, router]);

  const fetchPrescriptions = async () => {
    try {
      const data = await prescriptionService.getAllPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
      toast.error("Unable to load prescriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;

    try {
      await prescriptionService.deletePrescription(id);
      toast.success("Prescription deleted successfully.");
      fetchPrescriptions();
    } catch (error) {
      console.error("Failed to delete prescription:", error);
      toast.error("Unable to delete prescription. Please try again.");
    }
  };

  const openAddModal = () => {
    setEditingPrescription(null);
    setShowModal(true);
  };

  const openEditModal = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPrescription(null);
  };

  const handleSubmit = async (data: PrescriptionFormData) => {
    setSubmitting(true);
    try {
      const payload = {
        title: data.title,
        doctorName: data.doctorName,
        hospital: data.hospital,
        prescriptionDate: data.prescriptionDate,
        expiryDate: data.expiryDate,
        notes: data.notes,
        medicines: data.medicines?.map((m) => m.value).filter(Boolean),
        attachment: data.attachment?.[0],
      };

      if (editingPrescription) {
        await prescriptionService.updatePrescription(editingPrescription._id, payload);
        toast.success("Prescription updated successfully.");
      } else {
        await prescriptionService.createPrescription(payload);
        toast.success("Prescription uploaded successfully.");
      }
      closeModal();
      fetchPrescriptions();
    } catch (error) {
      console.error("Failed to save prescription:", error);
      toast.error("Unable to save prescription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    if (filters.search && !prescription.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && getPrescriptionDisplayStatus(prescription) !== filters.status) {
      return false;
    }
    return true;
  });

  const activePrescriptions = filteredPrescriptions.filter(
    (prescription) => getPrescriptionDisplayStatus(prescription) === "active"
  );
  const pastPrescriptions = filteredPrescriptions.filter(
    (prescription) => getPrescriptionDisplayStatus(prescription) === "expired"
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10">
            📄
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Prescriptions</h1>
            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
              Store and manage your prescription records.
            </p>
          </div>
        </div>

        <Button className="self-start rounded-full px-6 py-3 sm:self-auto" onClick={openAddModal}>
          + Upload Prescription
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <PrescriptionSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {prescriptions.length > 0 && (
            <PrescriptionFilters filters={filters} onFiltersChange={setFilters} />
          )}

          {prescriptions.length === 0 ? (
            <PrescriptionEmptyState variant="no-prescriptions" onAddPrescription={openAddModal} />
          ) : filteredPrescriptions.length === 0 ? (
            <PrescriptionEmptyState variant="no-results" />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Prescriptions</h2>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  {activePrescriptions.length} Active
                </span>
              </div>

              {activePrescriptions.length > 0 ? (
                <PrescriptionList
                  prescriptions={activePrescriptions}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No active prescriptions.</p>
              )}

              {pastPrescriptions.length > 0 && (
                <div className="mt-10">
                  <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Past Prescriptions</h2>
                  <PastPrescriptionsTable prescriptions={pastPrescriptions} onDelete={handleDelete} />
                </div>
              )}
            </>
          )}
        </>
      )}

      <Modal
        open={showModal}
        title={editingPrescription ? "Edit Prescription" : "Upload Prescription"}
        onClose={closeModal}
      >
        <PrescriptionForm
          existingPrescription={editingPrescription}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}
