import { NextRequest } from "next/server";
import { proxyFormData } from "../../_utils/auth-proxy";

export async function POST(request: NextRequest) {
  return proxyFormData(request, "/api/v1/auth/upload", "POST");
}
