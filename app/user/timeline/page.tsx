"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { timelineService } from "../../../services/timeline.service";
import { TimelineEvent } from "../../../types/timeline.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/Button";
import { Timeline } from "../../../components/timeline/Timeline";
import {
  TimelineFilters,
  TimelineCategory,
  TimelineRangePreset,
  CATEGORY_TYPES,
} from "../../../components/timeline/TimelineFilters";
import { TimelineSkeleton } from "../../../components/timeline/TimelineSkeleton";
import { TimelineEmptyState } from "../../../components/timeline/TimelineEmptyState";

const PAGE_SIZE = 20;

const rangeToFromDate = (preset: TimelineRangePreset): string | undefined => {
  if (preset === "all") return undefined;
  const from = new Date();
  from.setDate(from.getDate() - Number(preset));
  return from.toISOString().slice(0, 10);
};

export default function TimelinePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [category, setCategory] = useState<TimelineCategory>("all");
  const [range, setRange] = useState<TimelineRangePreset>("30");

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
        types: CATEGORY_TYPES[category],
        from: rangeToFromDate(range),
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
  }, [isAuthenticated, router, category, range]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const result = await timelineService.getTimeline({
        page: page + 1,
        pageSize: PAGE_SIZE,
        types: CATEGORY_TYPES[category],
        from: rangeToFromDate(range),
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
        description="A chronological journey of your health events and medical milestones."
      />

      <TimelineFilters
        category={category}
        onCategoryChange={setCategory}
        range={range}
        onRangeChange={setRange}
      />

      {loading ? (
        <TimelineSkeleton />
      ) : events.length === 0 ? (
        <TimelineEmptyState />
      ) : (
        <>
          <Timeline events={events} />

          {hasMore ? (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </Button>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-10 text-center dark:border-gray-800">
              <span className="text-2xl" aria-hidden="true">
                🗄️
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">No more records found for this period.</p>
              {range !== "all" && (
                <button
                  type="button"
                  onClick={() => setRange("all")}
                  className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Load older records
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
