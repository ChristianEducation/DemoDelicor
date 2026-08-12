import { AdminFilterProvider, AdminShell } from "@/components/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminFilterProvider>
      <AdminShell>{children}</AdminShell>
    </AdminFilterProvider>
  );
}
