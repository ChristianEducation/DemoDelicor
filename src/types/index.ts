export type ColegioId = "san-isidro" | "la-cruz";
export type PaymentStatus = "pagado" | "pendiente";
export type LunchSource = "online" | "manual";
export type CutoffMode = "automatico" | "abierto" | "cerrado";

export interface Colegio {
  id: ColegioId;
  name: string;
  shortName: string;
  comuna: string;
}

export interface Curso {
  id: string;
  name: string;
  nivel: "basica" | "media";
  orden: number;
}

export interface Estudiante {
  id: string;
  name: string;
  colegioId: ColegioId;
  cursoId: string;
  apoderadoName: string;
}

export interface PlatoOpcion {
  id: string;
  name: string;
  vegetariano: boolean;
}

export interface PostreOpcion {
  id: string;
  name: string;
}

export interface MenuDia {
  date: string;
  dayName: string;
  sopa: string;
  ensaladas: string[];
  platos: PlatoOpcion[];
  postres: PostreOpcion[];
}

/** Un almuerzo concreto de un estudiante en una fecha: plato + postre + estado de pago/entrega. */
export interface Almuerzo {
  id: string;
  studentId: string;
  colegioId: ColegioId;
  date: string;
  platoId: string;
  platoNombre: string;
  platoVegetariano: boolean;
  postreId: string;
  postreNombre: string;
  unitPrice: number;
  source: LunchSource;
  paymentStatus: PaymentStatus;
  purchaseId: string | null;
  createdAt: string;
}

/** Un pago único que agrupa uno o más Almuerzos comprados juntos (posible descuento por mes completo). */
export interface Compra {
  id: string;
  studentId: string;
  colegioId: ColegioId;
  purchasedAt: string;
  almuerzoIds: string[];
  subtotal: number;
  discountApplied: boolean;
  discountAmount: number;
  total: number;
}

export interface CartDaySelection {
  date: string;
  platoId: string;
  postreId: string;
}

export interface FuncionariosDia {
  colegioId: ColegioId;
  date: string;
  cantidad: number;
}

export interface DemoConfig {
  unitPrice: number;
  discountPercent: number;
  bookingCutoff: string;
  cutoffMode: CutoffMode;
}
