"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_TODAY,
  config as initialConfig,
  estudiantes,
  initialAlmuerzos,
  initialCompras,
  initialDeliveries,
} from "@/data/delicor-data";
import { menuAgosto } from "@/data/menu-agosto";
import { computePurchasePreview } from "@/lib/pricing";
import { deliveryKey } from "@/lib/operations";
import type { Almuerzo, CartDaySelection, ColegioId, Compra, CutoffMode, DemoConfig } from "@/types";

interface DemoState {
  selectedColegioId: ColegioId | null;
  selectedCursoId: string | null;
  selectedStudentId: string | null;
  selectedWeekIndex: number;
  cart: Record<string, CartDaySelection>;
  lastCompraId: string | null;
  almuerzos: Almuerzo[];
  compras: Compra[];
  deliveries: Record<string, string>;
  config: DemoConfig;
}

type Action =
  | { type: "hydrate"; payload: DemoState }
  | { type: "select-colegio"; colegioId: ColegioId }
  | { type: "select-curso"; cursoId: string }
  | { type: "select-estudiante"; studentId: string }
  | { type: "select-week"; index: number }
  | { type: "set-cart-day"; selection: CartDaySelection }
  | { type: "remove-cart-day"; date: string }
  | { type: "clear-cart" }
  | { type: "confirm-purchase"; almuerzos: Almuerzo[]; compra: Compra }
  | { type: "deliver"; key: string; deliveredAt: string }
  | { type: "deliver-sin-pago"; almuerzo: Almuerzo; key: string; deliveredAt: string }
  | { type: "update-cutoff-mode"; mode: CutoffMode }
  | { type: "reset" };

const createInitialState = (): DemoState => ({
  selectedColegioId: null,
  selectedCursoId: null,
  selectedStudentId: null,
  selectedWeekIndex: 1, // semana del 10-14 de agosto
  cart: {},
  lastCompraId: null,
  almuerzos: initialAlmuerzos,
  compras: initialCompras,
  deliveries: initialDeliveries,
  config: initialConfig,
});

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "select-colegio":
      return { ...state, selectedColegioId: action.colegioId, selectedCursoId: null, selectedStudentId: null, cart: {} };
    case "select-curso":
      return { ...state, selectedCursoId: action.cursoId, selectedStudentId: null, cart: {} };
    case "select-estudiante":
      return { ...state, selectedStudentId: action.studentId, cart: {}, lastCompraId: null };
    case "select-week":
      return { ...state, selectedWeekIndex: action.index };
    case "set-cart-day":
      return { ...state, cart: { ...state.cart, [action.selection.date]: action.selection } };
    case "remove-cart-day": {
      const next = { ...state.cart };
      delete next[action.date];
      return { ...state, cart: next };
    }
    case "clear-cart":
      return { ...state, cart: {} };
    case "confirm-purchase":
      return {
        ...state,
        almuerzos: [...state.almuerzos, ...action.almuerzos],
        compras: [action.compra, ...state.compras],
        cart: {},
        lastCompraId: action.compra.id,
      };
    case "deliver":
      return { ...state, deliveries: { ...state.deliveries, [action.key]: action.deliveredAt } };
    case "deliver-sin-pago":
      return {
        ...state,
        almuerzos: [...state.almuerzos, action.almuerzo],
        deliveries: { ...state.deliveries, [action.key]: action.deliveredAt },
      };
    case "update-cutoff-mode":
      return { ...state, config: { ...state.config, cutoffMode: action.mode } };
    case "reset":
      return createInitialState();
  }
}

interface DemoContextValue extends DemoState {
  hydrated: boolean;
  selectColegio: (colegioId: ColegioId) => void;
  selectCurso: (cursoId: string) => void;
  selectEstudiante: (studentId: string) => void;
  selectWeek: (index: number) => void;
  setCartDay: (selection: CartDaySelection) => void;
  removeCartDay: (date: string) => void;
  confirmPurchase: () => Compra | null;
  confirmDelivery: (studentId: string, date: string) => void;
  deliverSinPago: (studentId: string, colegioId: ColegioId, date: string, platoId: string, postreId: string) => void;
  updateCutoffMode: (mode: CutoffMode) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);
const STORAGE_KEY = "delicor-demo-state-v1";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "hydrate", payload: JSON.parse(saved) as DemoState });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const confirmPurchase = useCallback((): Compra | null => {
    const student = estudiantes.find((item) => item.id === state.selectedStudentId);
    if (!student) return null;
    const selections = Object.values(state.cart);
    if (selections.length === 0) return null;

    const almuerzos: Almuerzo[] = selections.map((selection, index) => {
      const dia = menuAgosto.find((item) => item.date === selection.date)!;
      const plato = dia.platos.find((item) => item.id === selection.platoId)!;
      const postre = dia.postres.find((item) => item.id === selection.postreId)!;
      return {
        id: `almuerzo-${Date.now()}-${index}`,
        studentId: student.id,
        colegioId: student.colegioId,
        date: selection.date,
        platoId: plato.id,
        platoNombre: plato.name,
        platoVegetariano: plato.vegetariano,
        postreId: postre.id,
        postreNombre: postre.name,
        unitPrice: state.config.unitPrice,
        source: "online",
        paymentStatus: "pagado",
        purchaseId: null,
        createdAt: new Date().toISOString(),
      };
    });

    const preview = computePurchasePreview(
      selections.map((item) => item.date),
      state.config,
    );
    const compraId = `compra-${Date.now()}`;
    almuerzos.forEach((item) => {
      item.purchaseId = compraId;
    });
    const compra: Compra = {
      id: compraId,
      studentId: student.id,
      colegioId: student.colegioId,
      purchasedAt: new Date().toISOString(),
      almuerzoIds: almuerzos.map((item) => item.id),
      subtotal: preview.subtotal,
      discountApplied: preview.fullMonth,
      discountAmount: preview.discountAmount,
      total: preview.total,
    };
    dispatch({ type: "confirm-purchase", almuerzos, compra });
    return compra;
  }, [state.cart, state.config, state.selectedStudentId]);

  const deliverSinPago = useCallback(
    (studentId: string, colegioId: ColegioId, date: string, platoId: string, postreId: string) => {
      const dia = menuAgosto.find((item) => item.date === date);
      if (!dia) return;
      const plato = dia.platos.find((item) => item.id === platoId);
      const postre = dia.postres.find((item) => item.id === postreId);
      if (!plato || !postre) return;
      const almuerzo: Almuerzo = {
        id: `almuerzo-manual-${Date.now()}`,
        studentId,
        colegioId,
        date,
        platoId: plato.id,
        platoNombre: plato.name,
        platoVegetariano: plato.vegetariano,
        postreId: postre.id,
        postreNombre: postre.name,
        unitPrice: state.config.unitPrice,
        source: "manual",
        paymentStatus: "pendiente",
        purchaseId: null,
        createdAt: new Date().toISOString(),
      };
      dispatch({
        type: "deliver-sin-pago",
        almuerzo,
        key: deliveryKey(studentId, date),
        deliveredAt: new Date().toISOString(),
      });
    },
    [state.config.unitPrice],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      hydrated,
      selectColegio: (colegioId) => dispatch({ type: "select-colegio", colegioId }),
      selectCurso: (cursoId) => dispatch({ type: "select-curso", cursoId }),
      selectEstudiante: (studentId) => dispatch({ type: "select-estudiante", studentId }),
      selectWeek: (index) => dispatch({ type: "select-week", index }),
      setCartDay: (selection) => dispatch({ type: "set-cart-day", selection }),
      removeCartDay: (date) => dispatch({ type: "remove-cart-day", date }),
      confirmPurchase,
      confirmDelivery: (studentId, date) =>
        dispatch({ type: "deliver", key: deliveryKey(studentId, date), deliveredAt: new Date().toISOString() }),
      deliverSinPago,
      updateCutoffMode: (mode) => dispatch({ type: "update-cutoff-mode", mode }),
      resetDemo: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: "reset" });
      },
    }),
    [confirmPurchase, deliverSinPago, hydrated, state],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used within DemoProvider");
  return value;
}

export { DEMO_TODAY };
