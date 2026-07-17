import { Modal } from "../Modal";
import { StatusBadge } from "../common/StatusBadge";
import { Button } from "../Button";
import { AdminUser } from "../../types/admin.types";

interface UserDetailsModalProps {
  open: boolean;
  user: AdminUser | null;
  loading?: boolean;
  onClose: () => void;
  onToggleStatus: (user: AdminUser) => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium capitalize text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

export function UserDetailsModal({ open, user, loading, onClose, onToggleStatus }: UserDetailsModalProps) {
  return (
    <Modal open={open} title="User Details" onClose={onClose}>
      {loading || !user ? (
        <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">Loading user details...</p>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow label="Username" value={user.username} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Gender" value={user.gender} />
            <DetailRow label="Role" value={user.role} />
            <DetailRow
              label="Joined"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            />
            <DetailRow
              label="Last updated"
              value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "-"}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Status</p>
              <StatusBadge status={user.status} className="mt-1" />
            </div>
            <Button
              variant={user.status === "active" ? "outline" : "primary"}
              onClick={() => onToggleStatus(user)}
            >
              {user.status === "active" ? "Deactivate user" : "Activate user"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
