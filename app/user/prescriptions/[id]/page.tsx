"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../contexts/AuthContext";
import { useToast } from "../../../../contexts/ToastContext";
import { prescriptionService } from "../../../../services/prescription.service";
import { Prescription, getPrescriptionDisplayStatus } from "../../../../types/prescription.types";
import { LoadingPrescriptions } from "../../../../components/prescriptions/LoadingPrescriptions";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  expired: "bg-red-50 text-red-600",
};

export default function PrescriptionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    prescriptionService
      .getPrescriptionById(params.id)
      .then(setPrescription)
      .catch((error) => {
        console.error("Failed to load prescription:", error);
        toast.error("Unable to load this prescription.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, params.id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;

    try {
      await prescriptionService.deletePrescription(params.id);
      toast.success("Prescription deleted successfully.");
      router.push("/user/prescriptions");
    } catch (error) {
      console.error("Failed to delete prescription:", error);
      toast.error("Unable to delete prescription. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <LoadingPrescriptions />;
  }

  if (!prescription) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-gray-500">
        <p>This prescription could not be found.</p>
        <Link href="/user/prescriptions" className="font-semibold text-blue-600">
          ← Back to Prescriptions
        </Link>
      </div>
    );
  }

  const status = getPrescriptionDisplayStatus(prescription);

  return (
    <div>
      <Link href="/user/prescriptions" className="mb-6 inline-block text-sm font-semibold text-blue-600">
        ← Back to Prescriptions
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{prescription.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {prescription.doctorName}
              {prescription.hospital ? ` · ${prescription.hospital}` : ""}
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Prescribed</span>
            <span className="font-medium text-gray-900">
              {new Date(prescription.prescriptionDate).toLocaleDateString()}
            </span>
          </div>
          {prescription.expiryDate && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Expires</span>
              <span className="font-medium text-gray-900">
                {new Date(prescription.expiryDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {prescription.medicines.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Medicines</p>
              <div className="flex flex-wrap gap-2">
                {prescription.medicines.map((medicine) => (
                  <span
                    key={medicine}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                  >
                    {medicine}
                  </span>
                ))}
              </div>
            </div>
          )}

          {prescription.notes && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</p>
              <p className="text-gray-700">{prescription.notes}</p>
            </div>
          )}

          {prescription.attachmentUrl && (
            <a
              href={prescription.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit rounded-lg bg-blue-50 px-4 py-2 font-semibold text-blue-700"
            >
              View Attachment
            </a>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-5">
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            Delete Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
