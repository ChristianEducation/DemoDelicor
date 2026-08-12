import type { MenuDia, PlatoOpcion, PostreOpcion } from "@/types";

/**
 * Minuta de agosto transcrita desde Menu-agosto.pdf (Delicor, Colegio San Isidro).
 * La misma minuta se usa para ambos colegios (San Isidro y La Cruz), según lo
 * informado en el SPEC. Un día (19 de agosto) no trae una alternativa
 * vegetariana identificable con certeza en el PDF fuente y se deja sin marcar,
 * en vez de inventar o etiquetar mal un plato.
 */

let platoSeq = 0;
let postreSeq = 0;

const plato = (name: string, vegetariano = false): PlatoOpcion => {
  platoSeq += 1;
  return { id: `plato-${platoSeq}`, name, vegetariano };
};

const postre = (name: string): PostreOpcion => {
  postreSeq += 1;
  return { id: `postre-${postreSeq}`, name };
};

const dayNames: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
};

function day(
  dateDay: number,
  weekday: number,
  sopa: string,
  ensaladas: string[],
  platos: PlatoOpcion[],
  postres: PostreOpcion[],
): MenuDia {
  const date = `2026-08-${String(dateDay).padStart(2, "0")}`;
  return { date, dayName: dayNames[weekday], sopa, ensaladas, platos, postres };
}

export const menuAgosto: MenuDia[] = [
  // Semana 1: 3-7 agosto
  day(3, 1, "Consomé natural", ["Lechuga", "Repollo", "Choclo"], [
    plato("Tallarines salsa boloñesa"),
    plato("Pollo al limón y romero con verduras salteadas"),
    plato("Budín de zapallo y choclo", true),
  ], [postre("Leche nevada"), postre("Duraznos en conserva"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(4, 2, "Crema de verduras", ["Lechuga escarola", "Zanahoria, maní y manzana", "Betarraga rallada"], [
    plato("Carne al jugo con arroz"),
    plato("Pescado finas hierbas con espinacas a la crema"),
    plato("Fritos de coliflor con arroz", true),
  ], [postre("Jalea crema ácida"), postre("Leche asada"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(5, 3, "Sopa natural", ["Lechuga", "Apio", "Brócoli-coliflor salsa golf"], [
    plato("Pastel de papas"),
    plato("Pollo a la plancha con verduras salteadas"),
    plato("Paquetes de repollo rellenos de verduras", true),
  ], [postre("Postre 3 leches"), postre("Mousse de chocolate"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(6, 4, "Sopa natural", ["Lechuga escarola", "Acelga con huevo duro rallado", "Zanahoria"], [
    plato("Lentejas a la parmesana", true),
    plato("Puchero a la chilena"),
    plato("Albóndigas con arvejas y papas doradas"),
  ], [postre("Bizcocho húmedo de chocolate"), postre("Bavarois"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(7, 5, "Sopa natural de pollo", ["Betarraga lluvia de huevo", "Lechuga", "Zanahoria"], [
    plato("Pescado apanado con arroz"),
    plato("Curry de pollo"),
    plato("Pastelera con huevo", true),
  ], [postre("Flan casero de vainilla"), postre("Helados"), postre("Ensalada de fruta"), postre("Surtido de fruta natural")]),

  // Semana 2: 10-14 agosto (semana inicial de la demo)
  day(10, 1, "Crema de espárragos", ["Lechuga escarola", "Betarraga lluvia de huevo", "Apio"], [
    plato("Pollo arvejado / arroz"),
    plato("Beef de cerdo / zanahorias al curry"),
    plato("Torta panqueque vegetariana", true),
  ], [postre("Duraznos al jugo"), postre("Sémola salsa frutilla"), postre("Fruta surtida"), postre("Ensalada de fruta")]),

  day(11, 2, "Sopa natural", ["Zanahoria", "Ensalada griega", "Lechuga escarola"], [
    plato("Lentejas / vienesa optativo"),
    plato("Pollo al wok / cous-cous mediterráneo"),
    plato("Arroz con fritos de coliflor", true),
  ], [postre("Manjarate casero"), postre("Flan de vainilla"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(12, 3, "Pantrucas", ["Ensalada de acelga con parmesano", "Crudité de verduras", "Lechuga"], [
    plato("Carne mechada / pastelera de choclo"),
    plato("Pescado a la vizcaína / guiso de acelga"),
    plato("Falafel", true),
  ], [postre("Rejilla"), postre("Jalea de naranja"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(13, 4, "Sopa natural", ["Mix de repollos", "Lechuga", "Ensalada waldorf"], [
    plato("Spaghetti salsa boloñesa"),
    plato("Juliana de vacuno / choclo a la mantequilla"),
    plato("Omelette de verduras y queso", true),
  ], [postre("Bavarois de piña"), postre("Arroz con leche casero"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(14, 5, "Sopa natural", ["Lechuga escarola", "Ensalada griega con garbanzos", "Zanahoria"], [
    plato("Pollo asado / papas fritas al horno"),
    plato("Chupe de mariscos"),
    plato("Ravioles salsa queso", true),
  ], [postre("Suspiro limeño"), postre("Helados sin sello"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  // Semana 3: 17-21 agosto
  day(17, 1, "Sopa de pollo cabellito de ángel", ["Lechuga escarola", "Repollo morado, zanahoria y repollo", "Pepino"], [
    plato("Pollo mongoliano / arroz chaufa"),
    plato("Carbonada"),
    plato("Garbanzos al curry / arroz", true),
  ], [postre("Flan de chocolate y caramelo"), postre("Mousse de berries"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(18, 2, "Sopa natural", ["Lechuga, rúcula y papas hilo", "Zanahoria con pasas", "Espinaca"], [
    plato("Porotos guisados"),
    plato("Pollo al limón / chapsui de verduras"),
    plato("Carbonada vegetariana", true),
  ], [postre("Clafouti de pera"), postre("Jalea bicolor"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(19, 3, "Sopa natural", ["Lechuga", "Mote al grano", "Apio"], [
    plato("Carne asada / papitas al romero"),
    plato("Lomito magro / tortilla de verduras"),
    plato("Wrap de verduras y atún"),
  ], [postre("Mousse de manjar casero"), postre("Bavarois de frambuesa"), postre("Ensalada de fruta"), postre("Manzanas y naranjas")]),

  day(20, 4, "Sopa de carne con caracolitos", ["Tomate y pepino", "Lechuga", "Acelga con crutones"], [
    plato("Hamburguesa atomatada con corbatitas"),
    plato("Panqueques rellenos de pollo / rellenos de choclo"),
    plato("Porotos guisados", true),
  ], [postre("Postre de maicena salsa caramelo"), postre("Flan de lúcuma"), postre("Ensalada de fruta"), postre("Manzanas y naranjas")]),

  day(21, 5, "Sopa natural", ["Lechuga", "Ensalada de apio", "Ensalada de arvejitas a la chilena"], [
    plato("Pizza napolitana", true),
    plato("Estofado de vacuno"),
    plato("Charquicán de cochayuyo"),
  ], [postre("Flan 3 leches"), postre("Helados sin sello"), postre("Ensalada de fruta"), postre("Manzanas y naranjas")]),

  // Semana 4: 24-28 agosto
  day(24, 1, "Crema de espárragos", ["Lechuga escarola", "Zanahoria", "Cous-cous de verduras"], [
    plato("Tallarinata salsa boloñesa / salsa 3 quesos"),
    plato("Chuleta asada / verduras a la mantequilla"),
    plato("Cremoso de mote con verduras", true),
  ], [postre("Duraznos al jugo con pastelera"), postre("Flan de vainilla"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(25, 2, "Mix 4 estaciones", ["Apio", "Coliflor salsa golf"], [
    plato("Pastel de choclo"),
    plato("Cazuela de ave"),
    plato("Zapallito relleno", true),
  ], [postre("Torta chocomanjar"), postre("Compota de fruta"), postre("Ensalada de fruta"), postre("Surtido de fruta natural")]),

  day(26, 3, "Consomé de ave natural", ["Lechuga", "Repollo mixto", "Cochayuyo con perejil"], [
    plato("Pescado frito / arroz graneado"),
    plato("Carne asada / cous-cous mediterráneo"),
    plato("Pastel de papas con pino de soja", true),
  ], [postre("Maicena salsa caramelo"), postre("Bavarois de piña"), postre("Ensalada de fruta"), postre("Surtido de fruta natural")]),

  day(27, 4, "Sopa natural", ["Tomate y pepino", "Lechuga", "Acelga con crutones"], [
    plato("Lentejas a la parmesana"),
    plato("Pollo grillé / tortilla de zanahoria"),
    plato("Medallones de verduras", true),
  ], [postre("Leche asada casera"), postre("Jalea salsa ácida"), postre("Fruta natural"), postre("Ensalada de fruta")]),

  day(28, 5, "Sopa natural de pollo", ["Betarraga lluvia de huevo", "Lechuga", "Zanahoria"], [
    plato("Carne al jugo / papas crema"),
    plato("Pad Thai de pollo"),
    plato("Paquetitos de repollo rellenos de verduras", true),
  ], [postre("Copa pie de limón"), postre("Helados sin sello"), postre("Ensalada de fruta"), postre("Surtido de fruta natural")]),

  // Semana 5: 31 agosto (único día, cierra el mes)
  day(31, 1, "Sopa natural", ["Apio", "Lechuga", "Porotos verdes"], [
    plato("Goulash de vacuno / arroz"),
    plato("Lomito mostaza / budín de choclo"),
    plato("Musaka de berenjenas", true),
  ], [postre("Leche nevada de chocolate"), postre("Mousse de lúcuma"), postre("Ensalada de fruta"), postre("Fruta natural")]),
];

export interface SemanaAgosto {
  id: string;
  label: string;
  shortLabel: string;
  startDate: string;
  endDate: string;
  days: MenuDia[];
}

function buildSemana(id: string, label: string, shortLabel: string, dates: string[]): SemanaAgosto {
  const days = menuAgosto.filter((d) => dates.includes(d.date));
  return { id, label, shortLabel, startDate: days[0].date, endDate: days[days.length - 1].date, days };
}

export const semanasAgosto: SemanaAgosto[] = [
  buildSemana("semana-03-07", "Semana del 3 al 7 de agosto", "3–7 ago", ["2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07"]),
  buildSemana("semana-10-14", "Semana del 10 al 14 de agosto", "10–14 ago", ["2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14"]),
  buildSemana("semana-17-21", "Semana del 17 al 21 de agosto", "17–21 ago", ["2026-08-17", "2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21"]),
  buildSemana("semana-24-28", "Semana del 24 al 28 de agosto", "24–28 ago", ["2026-08-24", "2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28"]),
  buildSemana("semana-31", "Semana del 31 de agosto", "31 ago", ["2026-08-31"]),
];

export const todosLosDiasHabilesAgosto: string[] = menuAgosto.map((d) => d.date);
