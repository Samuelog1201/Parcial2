import state from "../../flux/Store";  // Ruta correcta del store Flux
import type { Plant } from "../../services/Plants";
import Dispatcher from "../../flux/Dispatcher";
import { ActionTypes } from "../../flux/Actions";

class ModifyGarden extends HTMLElement {
  state = state;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state.on("change", () => this.render());
  }

  connectedCallback() {
    this.render();
  }

  togglePlant(plantId: string) {
    const garden = this.state.getGarden();
    if (garden.plantIds.includes(plantId)) {
      Dispatcher.dispatch({
        type: ActionTypes.REMOVE_FROM_GARDEN,
        payload: plantId,
      });
    } else {
      Dispatcher.dispatch({
        type: ActionTypes.ADD_TO_GARDEN,
        payload: plantId,
      });
    }
  }

  updateGardenName(newName: string) {
    Dispatcher.dispatch({
      type: ActionTypes.SET_GARDEN_NAME,
      payload: newName,
    });
  }

  render() {
    if (!this.shadowRoot) return;

    const garden = this.state.getGarden();
    const plants = this.state.getPlants();

    this.shadowRoot.innerHTML = `
      <style>
        h2, label {
          font-family: Arial, sans-serif;
          text-align: center;
        }
        .grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
        }
        plant-card {
          cursor: pointer;
          opacity: 1;
          transition: opacity 0.3s ease;
          margin: 8px;
          max-width: 250px;
          display: block;
        }
        plant-card.disabled {
          opacity: 0.5;
        }
        input[name="gardenName"] {
          margin: 10px auto 20px;
          display: block;
          font-size: 1.2rem;
          padding: 5px;
          width: 200px;
          border-radius: 5px;
          border: 1px solid #ccc;
          text-align: center;
        }
        form {
          margin: 20px auto;
          max-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        form input {
          padding: 8px;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        form button {
          padding: 10px;
          font-size: 1rem;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        form button:hover {
          background-color: #45a049;
        }
      </style>

      <h2>Modificar Jardín</h2>
      <label for="gardenName">Nombre del Jardín:</label>
      <input name="gardenName" type="text" value="${garden.name}" />
      
      <form id="addPlantForm">
        <h3>Agregar Nueva Planta</h3>
        <input name="commonName" type="text" placeholder="Nombre común" required />
        <input name="scientificName" type="text" placeholder="Nombre científico" required />
        <input name="img" type="text" placeholder="URL Imagen" />
        <input name="type" type="text" placeholder="Tipo" />
        <input name="origin" type="text" placeholder="Origen" />
        <input name="floweringSeason" type="text" placeholder="Temporada de floración" />
        <input name="sunExposure" type="text" placeholder="Exposición al sol" />
        <input name="watering" type="text" placeholder="Riego" />
        <button type="submit">Crear Planta</button>
      </form>

      <div class="grid">
        ${plants
          .map(
            (plant) =>
              `<plant-card class="${garden.plantIds.includes(plant.id) ? '' : 'disabled'}" data-id="${plant.id}"></plant-card>`
          )
          .join("")}
      </div>
    `;

    // Añadir listeners a las plant-cards para togglear plantas en el jardín
    const cards = this.shadowRoot.querySelectorAll("plant-card");
    cards.forEach((card) => {
      const id = card.getAttribute("data-id")!;
      card.addEventListener("click", () => this.togglePlant(id));
    });

    // Evento para cambiar nombre del jardín
    const input = this.shadowRoot.querySelector('input[name="gardenName"]') as HTMLInputElement;
    input.addEventListener("input", (e) => {
      this.updateGardenName((e.target as HTMLInputElement).value);
    });

    const Plantinput = this.shadowRoot.querySelector('input[name="NuevaPlanta"]') as HTMLInputElement;
    input.addEventListener("input", (e) => {
      this.updateGardenName((e.target as HTMLInputElement).value);
    });

    // Evento para el formulario de agregar planta nueva
    const form = this.shadowRoot.querySelector("#addPlantForm") as HTMLFormElement;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      // Generar id único para la planta (simple, basado en longitud + 1)
      const newId = (this.state.getPlants().length + 1).toString();

      const newPlant: Plant = {
        id: newId,
        commonName: formData.get("commonName") as string,
        scientificName: formData.get("scientificName") as string,
        img: (formData.get("img") as string) || "",
        type: (formData.get("type") as string) || "",
        origin: (formData.get("origin") as string) || "",
        floweringSeason: (formData.get("floweringSeason") as string) || "",
        sunExposure: (formData.get("sunExposure") as string) || "",
        watering: (formData.get("watering") as string) || "",
      };

      Dispatcher.dispatch({
        type: ActionTypes.ADD_PLANT,
        payload: newPlant,
      });

      form.reset();
    });
  }
}

customElements.define("modificar-jardin-view", ModifyGarden);
export default ModifyGarden;
