import state from "../../flux/Store";
import { Plant } from "../../services/Plants";

class CreatePlantView extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  addPlant() {
    const commonNameInput = this.shadow.querySelector("#commonName") as HTMLInputElement;
    const scientificNameInput = this.shadow.querySelector("#scientificName") as HTMLInputElement;
    

    const commonName = commonNameInput.value.trim();
    const scientificName = scientificNameInput.value.trim();
  

    if (!commonName || !scientificName) {
      alert("El nombre común y científico son obligatorios.");
      return;
    }

    // Crear nueva planta con id único simple (puedes mejorar esto)
    const newPlant: Plant = {
      id: Date.now().toString(),
      commonName,
      scientificName,
      img: "",
      type: "",
      origin: "",
      floweringSeason: "",
      sunExposure: "",
      watering: ""
    };

    state.addPlant(newPlant);

    // Limpiar inputs después de agregar
    commonNameInput.value = "";
    scientificNameInput.value = "";

    alert("Planta agregada correctamente!");
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        form {
          display: flex;
          flex-direction: column;
          max-width: 300px;
          margin: 0 auto;
          gap: 10px;
          font-family: Arial, sans-serif;
        }
        input, textarea, button {
          padding: 8px;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        button {
          background-color: #28a745;
          color: white;
          cursor: pointer;
          border: none;
        }
        button:hover {
          background-color: #218838;
        }
      </style>
      <form>
        <h2>Crear Nueva Planta</h2>
        <input id="commonName" type="text" placeholder="Nombre común" required />
        <input id="scientificName" type="text" placeholder="Nombre científico" required />
        <textarea id="description" rows="3" placeholder="Descripción (opcional)"></textarea>
        <button type="button" id="addButton">Agregar Planta</button>
      </form>
    `;

    this.shadow.querySelector("#addButton")?.addEventListener("click", () => this.addPlant());
  }
}

customElements.define("create-plant-view", CreatePlantView);
export default CreatePlantView;
