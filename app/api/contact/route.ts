import { NextResponse } from "next/server";

import { createStoredContactSubmission } from "@/lib/admin/contact-submissions";
import { isDatabaseConfigured } from "@/lib/db/prisma";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { contactSchema } from "@/lib/validation/contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit("contact-form", 8, 60_000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a moment." },
      { status: 429 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid name, email, and detailed message." },
      { status: 400 }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        ok: true,
        data: parsed.data,
        persisted: false
      },
      { status: 200 }
    );
  }

  const submission = await createStoredContactSubmission(parsed.data);

  return NextResponse.json(
    {
      ok: true,
      data: submission,
      persisted: true
    },
    { status: 200 }
  );
}
