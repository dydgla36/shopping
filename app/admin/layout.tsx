import AdminNav from "@/components/AdminNav";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "관리자" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <section style={{ padding: "56px 60px 0" }}>
      <h1 style={{ margin: 0, font: "800 30px Archivo,sans-serif", letterSpacing: ".06em" }}>ADMIN</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 48, marginTop: 32, alignItems: "flex-start" }}>
        <AdminNav />
        <div style={{ flex: "1 1 600px", minWidth: 0 }}>{children}</div>
      </div>
    </section>
  );
}
