"use client";

import { useEffect } from "react";
import { exposeBdmTrack } from "@/lib/bdmTrack";

/** Expone window.bdmTrack para el mapa (vacunatorios.js) y verifica Firebase. */
export function BdmTrackBoot() {
  useEffect(() => {
    exposeBdmTrack();
  }, []);
  return null;
}
