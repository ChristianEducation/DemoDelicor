import { notFound } from "next/navigation";
import { KitchenDashboard } from "@/components/kitchen-dashboard";
import { colegios } from "@/data/delicor-data";
import type { ColegioId } from "@/types";

function isColegioId(value: string): value is ColegioId {
  return colegios.some((item) => item.id === value);
}

export default async function CasinoColegioPage({ params }: { params: Promise<{ colegioId: string }> }) {
  const { colegioId } = await params;
  if (!isColegioId(colegioId)) notFound();
  return <KitchenDashboard colegioId={colegioId} />;
}
