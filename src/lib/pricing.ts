import { todosLosDiasHabilesAgosto } from "@/data/menu-agosto";
import type { DemoConfig } from "@/types";

/**
 * El descuento por "mes completo" solo aplica cuando la compra anticipada cubre,
 * en una sola operación, TODOS los días hábiles del mes de agosto (desde el primer
 * hasta el último). Comprar solo los días restantes una vez iniciado el mes NO activa
 * el descuento (SPEC 1.5).
 */
export function isFullMonthPurchase(dates: string[]): boolean {
  if (dates.length !== todosLosDiasHabilesAgosto.length) return false;
  const set = new Set(dates);
  return todosLosDiasHabilesAgosto.every((date) => set.has(date));
}

export interface PurchasePreview {
  dayCount: number;
  subtotal: number;
  fullMonth: boolean;
  discountAmount: number;
  total: number;
}

export function computePurchasePreview(dates: string[], config: DemoConfig): PurchasePreview {
  const dayCount = dates.length;
  const subtotal = dayCount * config.unitPrice;
  const fullMonth = isFullMonthPurchase(dates);
  const discountAmount = fullMonth ? Math.round((subtotal * config.discountPercent) / 100) : 0;
  return { dayCount, subtotal, fullMonth, discountAmount, total: subtotal - discountAmount };
}
