import { NextRequest } from "next/server";
import { proxyJson } from "../../_utils/auth-proxy";

export async function GET(request: NextRequest) {
  return proxyJson(
    request,
    `/api/v1/admin/users${request.nextUrl.search}`,
    "GET",
    { protected: true }
  );
}

export async function POST(request: NextRequest) {
  return proxyJson(request, "/api/v1/admin/users", "POST", { protected: true });
}
