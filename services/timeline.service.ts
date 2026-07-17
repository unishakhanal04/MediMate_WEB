import { apiFetch } from "./api-client";
import { PaginatedTimeline, TimelineQueryParams } from "../types/timeline.types";

export const timelineService = {
  async getTimeline(params: TimelineQueryParams = {}): Promise<PaginatedTimeline> {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? 1));
    query.set("pageSize", String(params.pageSize ?? 20));
    if (params.types?.length) query.set("type", params.types.join(","));
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);

    return apiFetch<PaginatedTimeline>(`/api/v1/timeline?${query.toString()}`);
  },
};
