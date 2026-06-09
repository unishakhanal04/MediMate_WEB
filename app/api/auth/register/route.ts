import { NextResponse } from "next/server";
import { API_BASE_URL } from "../../../../lib/constants";

export async function POST(request: Request) {
  const body = await request.text();

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
