"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { timelineService } from "../../../services/timeline.service";
import { TimelineEvent, TimelineEventType } from "../../../types/timeline.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/Button";
import { Timeline } from "../../../components/timeline/Timeline";
import { TimelineFilters } from "../../../components/timeline/TimelineFilters";
import { TimelineSkeleton } from "../../../components/timeline/TimelineSkeleton";
import { TimelineEmptyState } from "../../../components/timeline/TimelineEmptyState";

const PAGE_SIZE = 20;

export default function TimelinePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [type, setType] = useState<TimelineEventType | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    timelineService
      .getTimeline({
        page: 1,
        pageSize: PAGE_SIZE,
        types: type === "all" ? undefined : [type],
        from: from || undefined,
        to: to || undefined,
      })
      .then((result) => {
        setEvents(result.items);
        setPage(result.page);
        setHasMore(result.hasMore);
      })
      .catch((error) => {
        console.error("Failed to load timeline:", error);
        toast.error("Unable to load your health timeline.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router, type, from, to]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const result = await timelineService.getTimeline({
        page: page + 1,
        pageSize: PAGE_SIZE,
        types: type === "all" ? undefined : [type],
        from: from || undefined,
        to: to || undefined,
      });
      setEvents((prev) => [...prev, ...result.items]);
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more timeline events:", error);
      toast.error("Unable to load more events.");
    } finally {
      setLoadingMore(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <PageHeader
        icon="🕒"
        title="Health Timeline"
        description="A chronological view of your medications, prescriptions, appointments, and more."
      />

      <TimelineFilters
        type={type}
        onTypeChange={setType}
        from={from}
        onFromChange={setFrom}
        to={to}
        onToChange={setTo}
      />

      {loading ? (
        <TimelineSkeleton />
      ) : events.length === 0 ? (
        <TimelineEmptyState />
      ) : (
        <>
          <Timeline events={events} />

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
