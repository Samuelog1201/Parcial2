import Dispatcher, { Action } from "./Dispatcher";
import type { Plant } from "../services/Plants";

export const ActionTypes = {
  LOAD_PLANTS: "LOAD_PLANTS",
  ADD_TO_GARDEN: "ADD_TO_GARDEN",
  REMOVE_FROM_GARDEN: "REMOVE_FROM_GARDEN",
  SET_GARDEN_NAME: "SET_GARDEN_NAME",
  UPDATE_PLANT: "UPDATE_PLANT",
  SET_PAGE: "SET_PAGE",
  ADD_PLANT: "ADD_PLANT",  
};

export function loadPlants(plants: Plant[]) {
  Dispatcher.dispatch({
    type: ActionTypes.LOAD_PLANTS,
    payload: plants,
  });
}

export function addToGarden(plantId: string) {
  Dispatcher.dispatch({
    type: ActionTypes.ADD_TO_GARDEN,
    payload: plantId,
  });
}

export function removeFromGarden(plantId: string) {
  Dispatcher.dispatch({
    type: ActionTypes.REMOVE_FROM_GARDEN,
    payload: plantId,
  });
}

export function setGardenName(name: string) {
  Dispatcher.dispatch({
    type: ActionTypes.SET_GARDEN_NAME,
    payload: name,
  });
}

export function updatePlant(plant: Plant) {
  Dispatcher.dispatch({
    type: ActionTypes.UPDATE_PLANT,
    payload: plant,
  });
}

export function setPage(page: "inicio" | "modificar-jardin" | "modificar-plantas") {
  Dispatcher.dispatch({
    type: ActionTypes.SET_PAGE,
    payload: page,
  });
}


export function addPlant(plant: Plant) {
  Dispatcher.dispatch({
    type: ActionTypes.ADD_PLANT,
    payload: plant,
  });
}
