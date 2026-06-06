import { NextResponse } from "next/server";

export default function successResponse<T>(data: T) {
  return NextResponse.json(
    {
      data,
      error: null,
    },
    { status: 200 },
  );
}
