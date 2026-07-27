"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { useConfirmDialog } from "../../../contexts/ConfirmDialogContext";
import { medicineService, Medicine } from "../../../services/medicine.service";
import { reportsService, RefillAlert as RefillAlertData } from "../../../services/reports.service";
import { TodayMedicine, AdherenceStats } from "../../../types/medicine.types";
import { offlineStore, isNetworkFailure } from "../../../lib/offline-store";
import { MedicineModal } from "../../../components/medicines/MedicineModal";
import { MedicineStats } from "../../../components/medicines/MedicineStats";
import { MedicineSearch } from "../../../components/medicines/MedicineSearch";
import { MedicineFilters, MedicineFilterValue } from "../../../components/medicines/MedicineFilters";
import { MedicineCard } from "../../../components/medicines/MedicineCard";
import { EmptyMedicines } from "../../../components/medicines/EmptyMedicines";
import { LoadingMedicines } from "../../../components/medicines/LoadingMedicines";
import { TodayMedicines } from "../../../components/medicines/TodayMedicines";
import { RefillAlert } from "../../../components/medicines/RefillAlert";

export default function MedicinesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const confirmDialog = useConfirmDialog();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [todayMedicines, setTodayMedicines] = useState<TodayMedicine[]>([]);
  const [refillAlerts, setRefillAlerts] = useState<RefillAlertData[]>([]);
  const [stats, setStats] = useState<AdherenceStats>({
    weeklyAdherence: 0,
    medicinesTaken: 0,
    totalScheduled: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<MedicineFilterValue>("all");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchMedicines();
      fetchTodayMedicines();
      fetchStats();
      fetchRefillAlerts();
      if (typeof navigator !== "undefined" && navigator.onLine) {
        syncPendingTakes();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      syncPendingTakes();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await medicineService.getAllMedicines();
      setMedicines(data);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
      toast.error("Unable to load medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayMedicines = async () => {
    try {
      const data = await medicineService.getTodayMedicines();
      setTodayMedicines(data);
      offlineStore.saveTodayMedicines(data);
    } catch (error) {
      console.error("Failed to fetch today's medicines:", error);
      if (isNetworkFailure(error)) {
        const cached = offlineStore.loadTodayMedicines();
        if (cached) {
          setTodayMedicines(cached);
          return;
        }
      }
      toast.error("Unable to load today's medicines. Please try again.");
    }
  };

  // Retries any "mark as taken" taps that were queued while offline. Actions that
  // still fail for a network reason are kept for the next retry; anything that fails
  // for another reason (e.g. the medicine was deleted) is dropped rather than retried forever.
  const syncPendingTakes = async () => {
    const pending = offlineStore.getPendingTakes();
    if (pending.length === 0) return;

    const stillPending: typeof pending = [];
    let succeeded = 0;

    for (const action of pending) {
      try {
        await medicineService.markMedicineAsTaken(action.medicineId, action.scheduledTime);
        succeeded++;
      } catch (error) {
        console.error("Failed to sync offline medicine update:", error);
        if (isNetworkFailure(error)) {
          stillPending.push(action);
        }
      }
    }

    offlineStore.setPendingTakes(stillPending);
    if (succeeded > 0) {
      toast.success(`Synced ${succeeded} offline update${succeeded > 1 ? "s" : ""}.`);
      fetchTodayMedicines();
    }
  };

  const fetchStats = async () => {
    try {
      const data = await medicineService.getAdherenceStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch adherence stats:", error);
      toast.error("Unable to load adherence stats. Please try again.");
    }
  };

  const fetchRefillAlerts = async () => {
    try {
      const data = await reportsService.getRefillAlerts();
      setRefillAlerts(data);
    } catch (error) {
      console.error("Failed to fetch refill alerts:", error);
      toast.error("Unable to load refill alerts. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog({
      title: "Delete medicine",
      message: "Are you sure you want to delete this medicine?",
    });
    if (!confirmed) return;
    
    try {
      await medicineService.deleteMedicine(id);
      toast.success("Medicine deleted successfully.");
      fetchMedicines();
      fetchTodayMedicines();
      fetchStats();
      fetchRefillAlerts();
    } catch (error) {
      console.error("Failed to delete medicine:", error);
      toast.error("Unable to delete medicine. Please try again.");
    }
  };

  const handleMedicineTaken = async (medicineId: string, scheduledTime: string) => {
    try {
      await medicineService.markMedicineAsTaken(medicineId, scheduledTime);
      toast.success("Medicine marked as taken.");
      fetchTodayMedicines();
    } catch (error) {
      console.error("Failed to mark medicine as taken:", error);

      if (isNetworkFailure(error)) {
        offlineStore.queueTake({ medicineId, scheduledTime, queuedAt: new Date().toISOString() });
        setTodayMedicines((current) => {
          const next = current.map((medicine) =>
            medicine._id === medicineId && medicine.time === scheduledTime
              ? { ...medicine, status: "taken" as const }
              : medicine
          );
          offlineStore.saveTodayMedicines(next);
          return next;
        });
        toast.info("You're offline — saved and will sync automatically once you're back online.");
        return;
      }

      toast.error("Unable to mark medicine as taken. Please try again.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
  };

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const todayMedicineIds = new Set(todayMedicines.map((m) => m._id));
  const missedTodayMedicineIds = new Set(
    todayMedicines.filter((m) => m.status === "pending" && m.time < currentTime).map((m) => m._id)
  );

  const filteredMedicines = medicines
    .filter((medicine) => {
      const query = searchTerm.toLowerCase();
      if (!query) return true;
      return (
        medicine.name.toLowerCase().includes(query) ||
        medicine.dosage.toLowerCase().includes(query) ||
        (medicine.notes ?? "").toLowerCase().includes(query)
      );
    })
    .filter((medicine) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "completed") return medicine.status === "completed";
      if (selectedFilter === "today") return todayMedicineIds.has(medicine._id);
      if (selectedFilter === "missed") return missedTodayMedicineIds.has(medicine._id);
      return true;
    });

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <LoadingMedicines />;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-500/10">
            💊
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              My Medicines
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
              Manage your medications, track adherence, and stay on schedule.
            </p>
          </div>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:self-auto"
          onClick={() => {
            setEditingMedicine(null);
            setShowModal(true);
          }}
        >
          + Add Medicine
        </button>
      </div>

      {isOffline && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          📴 You're offline. Showing your last saved data — any changes will sync automatically once you're back online.
        </div>
      )}

      <div className="mb-8">
        <TodayMedicines medicines={todayMedicines} onMedicineTaken={handleMedicineTaken} />
      </div>

      <MedicineStats stats={stats} />

      <RefillAlert alerts={refillAlerts} />

      <MedicineSearch value={searchTerm} onChange={setSearchTerm} />

      <MedicineFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

      {medicines.length === 0 ? (
        <EmptyMedicines
          onAddMedicine={() => {
            setEditingMedicine(null);
            setShowModal(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {filteredMedicines.map((medicine) => (
            <MedicineCard
              key={medicine._id}
              medicine={medicine}
              onEdit={(medicine) => {
                setEditingMedicine(medicine);
                setShowModal(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <MedicineModal
        open={showModal}
        medicine={editingMedicine}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          fetchMedicines();
          fetchTodayMedicines();
          fetchStats();
          fetchRefillAlerts();
        }}
        toast={toast}
      />
    </div>
  );
}

