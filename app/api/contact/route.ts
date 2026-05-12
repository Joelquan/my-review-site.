export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createDocument, Collections } from "@/lib/firebase/firestore";

interface ContactPayload {
  type: "contact" | "prayer" | "testimony";
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  request?: string;
  title?: string;
  body?: string;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as ContactPayload;

    if (!payload.type) {
      return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    if (payload.type === "contact") {
      if (!payload.message?.trim()) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
      }
      await createDocument("contact_messages", {
        name:    payload.name    ?? "Anonymous",
        email:   payload.email   ?? "",
        subject: payload.subject ?? "",
        message: payload.message,
      });
    } else if (payload.type === "prayer") {
      if (!payload.request?.trim()) {
        return NextResponse.json({ error: "Prayer request is required" }, { status: 400 });
      }
      await createDocument(Collections.PRAYERS, {
        name:    payload.name  ?? "Anonymous",
        email:   payload.email ?? "",
        request: payload.request,
        status:  "pending",
      });
    } else if (payload.type === "testimony") {
      if (!payload.body?.trim() || !payload.title?.trim()) {
        return NextResponse.json({ error: "Title and testimony are required" }, { status: 400 });
      }
      await createDocument(Collections.TESTIMONIES, {
        name:     payload.name  ?? "Anonymous",
        title:    payload.title,
        body:     payload.body,
        approved: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
