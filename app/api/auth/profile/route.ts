import { NextRequest } from "next/server";
import { proxyFormData, proxyJson } from "../../_utils/auth-proxy";

export async function PUT(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    return proxyFormData(request, "/api/v1/auth/profile", "PUT");
  }

  return proxyJson(request, "/api/v1/auth/profile", "PUT", { protected: true });
}
