import type { Metadata } from "next";
import ContentManager from "@/components/admin/ContentManager";

export const metadata: Metadata = { title: "Content Manager – Admin" };

export default function ContentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Content Manager</h1>
        <p className="text-navy-400 text-sm">Manage verses, devotionals, prayers, and testimonies.</p>
      </div>
      <ContentManager />
    </div>
  );
}
