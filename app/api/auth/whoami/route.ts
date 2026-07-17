import { NextRequest } from "next/server";
import { proxyJson } from "../../_utils/auth-proxy";

export async function GET(request: NextRequest) {
  return proxyJson(request, "/api/v1/auth/whoami", "GET", { protected: true });
}
