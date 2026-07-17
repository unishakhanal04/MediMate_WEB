import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { proxyJson } from "../../_utils/auth-proxy";

export async function POST(request: NextRequest) {
  const proxyResponse = await proxyJson(request, "/api/v1/auth/login", "POST");
  let data;
  try {
    data = await proxyResponse.json();
  } catch {
    data = { success: false, message: "Empty login response" };
  }

  const response = NextResponse.json(data, { status: proxyResponse.status });

  const token = data?.data?.token;
  if (token) {
    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return response;
}
