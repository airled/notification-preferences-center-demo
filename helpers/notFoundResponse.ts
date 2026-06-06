import { NextResponse } from "next/server";

export default function notFoundResponse(entityName: string) {
  return NextResponse.json(
    { data: null, error: `${entityName} not found` },
    { status: 404 },
  );
}
