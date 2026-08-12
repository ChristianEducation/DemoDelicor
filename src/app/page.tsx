"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { IntroModal } from "@/components/intro-modal";
import { PortalShell } from "@/components/portal-shell";
import { colegios, cursos, estudiantes, flagshipDebtorId } from "@/data/delicor-data";
import { useDemo } from "@/store/demo-store";

export default function HomePage() {
  const router = useRouter();
  const { selectedColegioId, selectedCursoId, selectedStudentId, selectColegio, selectCurso, selectEstudiante } = useDemo();

  const studentsForCurso = selectedColegioId && selectedCursoId
    ? estudiantes.filter((item) => item.colegioId === selectedColegioId && item.cursoId === selectedCursoId)
    : [];

  const continueToWeek = () => {
    if (!selectedStudentId) return;
    router.push("/semana");
  };

  const chooseDemoStudent = () => {
    const student = estudiantes.find((item) => item.id === flagshipDebtorId)!;
    selectColegio(student.colegioId);
    selectCurso(student.cursoId);
    selectEstudiante(student.id);
  };

  return (
    <PortalShell step={1}>
      <div className="mx-auto max-w-lg">
        <span className="eyebrow">Bienvenido</span>
        <h1 className="display-font mt-2 text-[1.85rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.05rem]">
          Reserva y paga el almuerzo de tu hijo o hija
        </h1>
        <p className="mt-3 text-[var(--muted)]">Selecciona el colegio, el curso y el estudiante para ver la minuta de la semana.</p>

        <div className="surface mt-7 grid grid-cols-1 gap-4 rounded-2xl p-5 sm:p-6">
          <label className="grid grid-cols-1 gap-1.5">
            <span className="text-xs font-extrabold uppercase tracking-[0.06em] text-[var(--muted)]">Colegio</span>
            <select
              className="field"
              value={selectedColegioId ?? ""}
              onChange={(event) => selectColegio(event.target.value as (typeof colegios)[number]["id"])}
            >
              <option value="">Selecciona un colegio</option>
              {colegios.map((colegio) => (
                <option key={colegio.id} value={colegio.id}>{colegio.name}</option>
              ))}
            </select>
          </label>

          <label className="grid grid-cols-1 gap-1.5">
            <span className="text-xs font-extrabold uppercase tracking-[0.06em] text-[var(--muted)]">Curso</span>
            <select
              className="field"
              value={selectedCursoId ?? ""}
              disabled={!selectedColegioId}
              onChange={(event) => selectCurso(event.target.value)}
            >
              <option value="">{selectedColegioId ? "Selecciona un curso" : "Primero selecciona el colegio"}</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>{curso.name}</option>
              ))}
            </select>
          </label>

          <label className="grid grid-cols-1 gap-1.5">
            <span className="text-xs font-extrabold uppercase tracking-[0.06em] text-[var(--muted)]">Estudiante</span>
            <select
              className="field"
              value={selectedStudentId ?? ""}
              disabled={!selectedCursoId}
              onChange={(event) => selectEstudiante(event.target.value)}
            >
              <option value="">{selectedCursoId ? "Selecciona un estudiante" : "Primero selecciona el curso"}</option>
              {studentsForCurso.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </label>

          <button type="button" className="btn-primary mt-1" disabled={!selectedStudentId} onClick={continueToWeek}>
            Continuar <ArrowRight size={17} />
          </button>
        </div>

        <button type="button" className="btn-quiet mt-3 w-full justify-center text-xs" onClick={chooseDemoStudent}>
          <Sparkles size={14} /> Completar con un estudiante de ejemplo
        </button>
      </div>
      <IntroModal />
    </PortalShell>
  );
}
