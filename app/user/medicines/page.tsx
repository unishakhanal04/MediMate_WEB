"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { medicineService, Medicine } from "../../../services/medicine.service";
import { reportsService, RefillAlert as RefillAlertData } from "../../../services/reports.service";
import { TodayMedicine, AdherenceStats } from "../../../types/medicine.types";
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchMedicines();
      fetchTodayMedicines();
      fetchStats();
      fetchRefillAlerts();
    }
  }, [isAuthenticated, router]);

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
    } catch (error) {
      console.error("Failed to fetch today's medicines:", error);
      toast.error("Unable to load today's medicines. Please try again.");
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
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    
    try {
      await medicineService.deleteMedicine(id);
      toast.success("Medicine deleted successfully.");
      fetchMedicines();
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
      toast.error("Unable to mark medicine as taken. Please try again.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
  };

  const filteredMedicines = medicines
    .filter((medicine) => medicine.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((medicine) => {
      if (selectedFilter === "all") return true;
      if (selectedFilter === "active" || selectedFilter === "completed") {
        return medicine.status === selectedFilter;
      }
      return medicine.frequency === selectedFilter;
    });

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <LoadingMedicines />;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
            💊
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              My Medicines
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-gray-500 sm:text-base">
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
        }}
        toast={toast}
      />
    </div>
  );
}

