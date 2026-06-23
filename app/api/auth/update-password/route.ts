import { NextRequest } from "next/server";
import { proxyJson } from "../../_utils/auth-proxy";

export async function PUT(request: NextRequest) {
  return proxyJson(request, "/api/v1/auth/update-password", "PUT", {
    protected: true,
  });
}
