export interface TodayMedicine {
  _id: string;
  name: string;
  dosage: string;
  time: string;
  status: "taken" | "pending" | "skipped" | "missed";
  logId?: string;
}

export interface MedicineLog {
  _id: string;
  medicineId: string;
  userId: string;
  takenAt: string;
  scheduledTime: string;
  status: "taken" | "skipped" | "missed";
  createdAt: string;
  updatedAt?: string;
}

export interface AdherenceStats {
  weeklyAdherence: number;
  medicinesTaken: number;
  totalScheduled: number;
  streak: number;
}
