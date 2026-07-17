import { NextRequest } from "next/server";
import { proxyJson } from "../../../_utils/auth-proxy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyJson(request, `/api/v1/admin/users/${id}`, "GET", { protected: true });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyJson(request, `/api/v1/admin/users/${id}`, "PATCH", { protected: true });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyJson(request, `/api/v1/admin/users/${id}`, "PUT", { protected: true });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  return proxyJson(request, `/api/v1/admin/users/${id}`, "DELETE", { protected: true });
}
