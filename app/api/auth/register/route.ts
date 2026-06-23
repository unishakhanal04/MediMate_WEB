import { NextRequest } from "next/server";
import { proxyJson } from "../../_utils/auth-proxy";

export async function POST(request: NextRequest) {
  return proxyJson(request, "/api/v1/auth/register", "POST");
}
