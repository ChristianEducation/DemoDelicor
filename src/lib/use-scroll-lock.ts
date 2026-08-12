"use client";

import { useEffect } from "react";

/**
 * Bloquea el scroll del body mientras `active` es true, y lo restaura apenas deja de serlo
 * (o al desmontar). Por defecto `active=true`, para el caso común de un modal que solo se
 * monta mientras está abierto.
 */
export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
