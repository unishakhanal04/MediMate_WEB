import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "../../../lib/constants";

const backendUrl = (path: string) => `${API_BASE_URL}${path}`;

const jsonResponse = (data: unknown, status: number) =>
  NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });

const readBackendJson = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return { success: false, message: "Empty backend response" };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { success: false, message: text };
  }
};

export const getBearerToken = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }

  return request.cookies.get("token")?.value;
};

export const proxyJson = async (
  request: NextRequest,
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  options: { protected?: boolean } = {}
) => {
  const headers: Record<string, string> = {};

  if (options.protected) {
    const token = getBearerToken(request);
    if (!token) {
      return jsonResponse({ success: false, message: "No token provided" }, 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let body: string | undefined;
  if (method !== "GET") {
    body = await request.text();
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(backendUrl(path), {
      method,
      headers,
      body,
    });
  } catch {
    return jsonResponse(
      { success: false, message: "Unable to reach backend API" },
      502
    );
  }

  const data = await readBackendJson(response);
  return jsonResponse(data, response.status);
};

export const proxyFormData = async (
  request: NextRequest,
  path: string,
  method: "POST" | "PUT"
) => {
  const token = getBearerToken(request);
  if (!token) {
    return jsonResponse({ success: false, message: "No token provided" }, 401);
  }

  const formData = await request.formData();
  let response: Response;
  try {
    response = await fetch(backendUrl(path), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch {
    return jsonResponse(
      { success: false, message: "Unable to reach backend API" },
      502
    );
  }

  const data = await readBackendJson(response);
  return jsonResponse(data, response.status);
};
