import Dispatcher, { Action } from "./Dispatcher";
import { EventEmitter } from "events";
import type { Plant } from "../services/Plants";
import { ActionTypes } from "./Actions";
import { getPlants } from "../services/Plants"; 

interface Garden {
  name: string;
  plantIds: string[];
}

export interface State {
  plants: Plant[];
  garden: Garden;
  currentPage: "inicio" | "modificar-jardin" | "modificar-plantas";
}

class Store extends EventEmitter {
  private plants: Plant[] = [];
  private garden: Garden = { name: "Mi Jardín", plantIds: [] };
  private currentPage: "inicio" | "modificar-jardin" | "modificar-plantas" = "inicio";

  constructor() {
    super();
    Dispatcher.register(this.handleActions.bind(this));
    this.loadPlantsFromService(); // Carga inicial de plantas
  }

  private loadPlantsFromService() {
    const plants = getPlants(); // Obtener plantas desde el servicio (data.json)
    this.plants = plants;
    this.emit("change");
  }

  setPage(page: "inicio" | "modificar-jardin" | "modificar-plantas") {
    Dispatcher.dispatch({
      type: ActionTypes.SET_PAGE,
      payload: page,
    });
  }

  subscribe(callback: () => void) {
    this.on("change", callback);
  }

  unsubscribe(callback: () => void) {
    this.off("change", callback);
  }

  private handleActions(action: Action) {
    switch (action.type) {
      case ActionTypes.LOAD_PLANTS:
        this.plants = action.payload;
        this.emit("change");
        break;
      case ActionTypes.ADD_TO_GARDEN:
        if (!this.garden.plantIds.includes(action.payload)) {
          this.garden.plantIds.push(action.payload);
          this.emit("change");
        }
        break;
      case ActionTypes.REMOVE_FROM_GARDEN:
        this.garden.plantIds = this.garden.plantIds.filter((id) => id !== action.payload);
        this.emit("change");
        break;
      case ActionTypes.SET_GARDEN_NAME:
        this.garden.name = action.payload;
        this.emit("change");
        break;
      case ActionTypes.UPDATE_PLANT:
        this.plants = this.plants.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
        this.emit("change");
        break;
      case ActionTypes.SET_PAGE:
        this.currentPage = action.payload;
        this.emit("change");
        break;

      case ActionTypes.ADD_PLANT:
        this.plants = [...this.plants, action.payload];
        this.emit("change");
        break;
    }
  }

  getPlants() {
    return [...this.plants].sort((a, b) => a.commonName.localeCompare(b.commonName));
  }

  getGarden() {
    return this.garden;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  addPlantToGarden(plantId: string) {
    Dispatcher.dispatch({
      type: ActionTypes.ADD_TO_GARDEN,
      payload: plantId,
    });
  }

  removePlantFromGarden(plantId: string) {
    Dispatcher.dispatch({
      type: ActionTypes.REMOVE_FROM_GARDEN,
      payload: plantId,
    });
  }

  setGardenName(name: string) {
    Dispatcher.dispatch({
      type: ActionTypes.SET_GARDEN_NAME,
      payload: name,
    });
  }

  loadPlants(plants: Plant[]) {
    Dispatcher.dispatch({
      type: ActionTypes.LOAD_PLANTS,
      payload: plants,
    });
  }

  addPlant(plant: Plant) {
    Dispatcher.dispatch({
      type: ActionTypes.ADD_PLANT,
      payload: plant,
    });
  }
}

export default new Store();
