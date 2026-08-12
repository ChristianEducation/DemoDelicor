export interface TourStep {
  anchor?: string;
  title: string;
  body: string;
}

export const apoderadoTourSteps: TourStep[] = [
  {
    anchor: "week-strip",
    title: "Tu semana",
    body: "Navega entre las semanas de agosto y toca un día disponible para abrir su menú.",
  },
  {
    anchor: "day-list",
    title: "Plato y postre",
    body: "Cada día muestra sopa y ensaladas como información, y debes elegir 1 plato de fondo (uno de ellos siempre vegetariano) y 1 postre antes de agregarlo al carrito.",
  },
  {
    anchor: "cart-sidebar",
    title: "Un solo pago",
    body: "Agrega los días que necesites — 1, 3, 12, los que sean — y págalos todos juntos. Si compras por adelantado todos los días hábiles del mes en una sola compra, se aplica un 10% de descuento automático.",
  },
  {
    title: "Ausencia",
    body: "El botón \"Marcar ausencia\" solo abre el punto de entrada a ese flujo. Las reglas de horario y descuento por inasistencia se definirán junto a Delicor después del cierre comercial.",
  },
];

export const cocinaTourSteps: TourStep[] = [
  {
    anchor: "panel-date",
    title: "Todo depende del día",
    body: "Elige primero la fecha. Preparación es la vista de cocina; Entrega es la del mesón.",
  },
  {
    anchor: "panel-metrics",
    title: "Qué preparar",
    body: "Cuántos almuerzos hay comprados con anticipación, cuántos ya se entregaron y cuántos funcionarios están informados para ese día, ya sumados.",
  },
  {
    anchor: "panel-entrega-tab",
    title: "Una fila por alumno",
    body: "Busca por nombre o curso. Si el alumno ya pagó, aparece su plato y postre listos para entregar con un clic.",
  },
  {
    title: "Si llega sin pago registrado",
    body: "No hay una segunda fila: en la misma pantalla de Entrega eliges su plato y postre y presionas Entregar. El sistema registra automáticamente el pendiente de cobro para Administración.",
  },
  {
    anchor: "panel-cutoff",
    title: "Esto es solo para la demostración",
    body: "Este control no forma parte del sistema real. Sirve para mostrar en vivo qué pasa cuando un día deja de aceptar compras online: es lo que hace aparecer \"Cerrado\" en la pantalla del apoderado.",
  },
];

export const infoTips = {
  fullMonthDiscount:
    "Si en una sola compra anticipada seleccionas todos los días hábiles del mes, desde el primero hasta el último, Delicor reconoce la compra completa y aplica un 10% de descuento demostrativo. Comprar solo los días que quedan una vez iniciado el mes no activa este descuento.",
  pendingFilterDefault: "La lista parte mostrando solo los pendientes de entregar. Cambia a \"Todos\" para ver también a quienes ya se entregaron.",
  preparacionMetric:
    "Cuenta los almuerzos comprados con anticipación por los apoderados. Los que Cocina registra el mismo día sin pago se ven en Entrega y en Administración, pero no acá, porque aún no se conocían con anticipación.",
};
