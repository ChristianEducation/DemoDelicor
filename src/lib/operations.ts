import type { Almuerzo, ColegioId } from "@/types";

export const deliveryKey = (studentId: string, date: string) => `${studentId}__${date}`;

export function almuerzosForColegioDate(almuerzos: Almuerzo[], colegioId: ColegioId, date: string) {
  return almuerzos.filter((item) => item.colegioId === colegioId && item.date === date);
}

export interface ConteoItem {
  id: string;
  name: string;
  vegetariano?: boolean;
  cantidad: number;
}

/** Cuenta unidades por plato/postre para la vista de Preparación de Cocina. */
export function contarPlatosYPostres(almuerzos: Almuerzo[]) {
  const platos = new Map<string, ConteoItem>();
  const postres = new Map<string, ConteoItem>();
  for (const item of almuerzos) {
    const p = platos.get(item.platoId) ?? { id: item.platoId, name: item.platoNombre, vegetariano: item.platoVegetariano, cantidad: 0 };
    p.cantidad += 1;
    platos.set(item.platoId, p);
    const d = postres.get(item.postreId) ?? { id: item.postreId, name: item.postreNombre, cantidad: 0 };
    d.cantidad += 1;
    postres.set(item.postreId, d);
  }
  return {
    platos: Array.from(platos.values()).sort((a, b) => b.cantidad - a.cantidad),
    postres: Array.from(postres.values()).sort((a, b) => b.cantidad - a.cantidad),
  };
}

export type EntregaEstado = "pagado" | "pendiente" | "sin-registro";

export interface PaqueteEntrega {
  studentId: string;
  date: string;
  almuerzo: Almuerzo | null;
  estado: EntregaEstado;
  entregadoAt: string | null;
}

export function paqueteParaEstudiante(
  almuerzos: Almuerzo[],
  deliveries: Record<string, string>,
  studentId: string,
  date: string,
): PaqueteEntrega {
  const almuerzo = almuerzos.find((item) => item.studentId === studentId && item.date === date) ?? null;
  const entregadoAt = deliveries[deliveryKey(studentId, date)] ?? null;
  const estado: EntregaEstado = !almuerzo ? "sin-registro" : almuerzo.paymentStatus === "pagado" ? "pagado" : "pendiente";
  return { studentId, date, almuerzo, estado, entregadoAt };
}

export interface DeudaEstudiante {
  studentId: string;
  consumos: Almuerzo[];
  total: number;
}

/** Agrupa por estudiante todos los almuerzos entregados sin pago (pendientes de cobro),
 * conservando cada consumo individual para trazabilidad (SPEC 3.5 / 4.4). */
export function deudasPorEstudiante(almuerzos: Almuerzo[], deliveries: Record<string, string>): DeudaEstudiante[] {
  const pendientesEntregados = almuerzos.filter(
    (item) => item.paymentStatus === "pendiente" && deliveries[deliveryKey(item.studentId, item.date)],
  );
  const map = new Map<string, Almuerzo[]>();
  for (const item of pendientesEntregados) {
    const list = map.get(item.studentId) ?? [];
    list.push(item);
    map.set(item.studentId, list);
  }
  return Array.from(map.entries())
    .map(([studentId, consumos]) => ({
      studentId,
      consumos: consumos.sort((a, b) => a.date.localeCompare(b.date)),
      total: consumos.reduce((sum, item) => sum + item.unitPrice, 0),
    }))
    .sort((a, b) => b.total - a.total);
}
