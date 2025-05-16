import type { Plant } from "../services/Plants";

interface State {
  plants: Plant[];
  garden: {
    name: string;
    plantIds: string[];
  };
  currentPage: "inicio" | "modificar-jardin" | "modificar-plantas";
}

export function isStateValid(state: State): boolean {
  if (!state) return false;
  if (!Array.isArray(state.plants)) return false;
  if (!state.garden || typeof state.garden.name !== "string" || state.garden.name.trim() === "") return false;
  if (!Array.isArray(state.garden.plantIds)) return false;
  if (!["inicio", "modificar-jardin", "modificar-plantas"].includes(state.currentPage)) return false;
  
  return true;
}
