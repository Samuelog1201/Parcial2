import state  from "../flux/Store"; 
import { Attribute } from "../components/Card/Card";
import { isStateValid } from "../utils/StateCheck"; 
class Root extends HTMLElement {
  shadowRoot: ShadowRoot;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open" });

    // Escuchar cambios del estado para rerenderizar
    state.on("change", () => this.render());
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    // Obtener estado actual
    const currentState = {
      plants: state.getPlants(),
      garden: state.getGarden(),
      currentPage: state.getCurrentPage(),
    };

    // Validar estado antes de renderizar
    if (!isStateValid(currentState)) {
      this.shadowRoot.innerHTML = `<p>Error: Estado inválido</p>`;
      return;
    }

    // Navegación y contenido principal
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          margin-bottom: 1rem;
        }
        nav button {
          margin-right: 0.5rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
        form {
          margin-bottom: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
      </style>

      <nav>
        <button id="btnInicio">Inicio</button>
        <button id="btnModGarden">Modificar Jardín</button>
        <button id="btnModPlants">Modificar Plantas</button>
      </nav>

      <div id="content"></div>
    `;

    // Botones de navegación
    this.shadowRoot.querySelector("#btnInicio")?.addEventListener("click", () => {
      state.setPage("inicio");
    });
    this.shadowRoot.querySelector("#btnModGarden")?.addEventListener("click", () => {
      state.setPage("modificar-jardin");
    });
    this.shadowRoot.querySelector("#btnModPlants")?.addEventListener("click", () => {
      state.setPage("modificar-plantas");
    });

    const content = this.shadowRoot.querySelector("#content")!;
    switch (currentState.currentPage) {
      case "inicio":
        content.innerHTML = `
          <h2>Bienvenido al Jardín</h2>
          <div class="grid" id="plantGrid"></div>
        `;

        const grid = content.querySelector("#plantGrid")!;
        currentState.plants.forEach((plant) => {
          const card = document.createElement("my-card");
          card.setAttribute(Attribute.img, plant.img);
          card.setAttribute(Attribute.commonName, plant.commonName);
          card.setAttribute(Attribute.scientificName, plant.scientificName);
          card.setAttribute(Attribute.type, plant.type);
          card.setAttribute(Attribute.origin, plant.origin);
          card.setAttribute(Attribute.floweringSeason, plant.floweringSeason);
          card.setAttribute(Attribute.sunExposure, plant.sunExposure);
          card.setAttribute(Attribute.watering, plant.watering);

          grid.appendChild(card);
        });
        break;

      case "modificar-jardin":
        content.innerHTML = `
          <h2>Modificar Nombre del Jardín</h2>
          <form id="formGardenName">
            <label for="gardenNameInput">Nombre del Jardín:</label>
            <input type="text" id="gardenNameInput" value="${currentState.garden.name}" />
            <button type="submit">Guardar</button>
          </form>
        `;

        const form = content.querySelector("#formGardenName") as HTMLFormElement;
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector("#gardenNameInput") as HTMLInputElement;
          state.setGardenName(input.value);
        });
        break;

      case "modificar-plantas":
        content.innerHTML = `
          <h2>Modificar Plantas</h2>
          <select id="plantSelector">
            ${currentState.plants
              .map(
                (plant) =>
                  `<option value="${plant.id}">${plant.commonName}</option>`
              )
              .join("")}
          </select>
          <div id="editPlantFormContainer"></div>
        `;

        const selector = content.querySelector("#plantSelector") as HTMLSelectElement;
        const formContainer = content.querySelector(
          "#editPlantFormContainer"
        )!;

        function renderEditForm(plantId: string) {
          const plant = currentState.plants.find((p) => p.id === plantId);
          if (!plant) {
            formContainer.innerHTML = "<p>Planta no encontrada</p>";
            return;
          }

          formContainer.innerHTML = `
            <form id="editPlantForm">
              <label>
                Nombre común:
                <input name="commonName" value="${plant.commonName}" />
              </label><br/>
              <label>
                Nombre científico:
                <input name="scientificName" value="${plant.scientificName}" />
              </label><br/>
              <button type="submit">Guardar</button>
            </form>
          `;

          const form = formContainer.querySelector(
            "#editPlantForm"
          ) as HTMLFormElement;

          form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedPlant = {
              ...plant,
              commonName: formData.get("commonName") as string,
              scientificName: formData.get("scientificName") as string,
            };

            // Actualizar plantas en el estado
            const newPlants = currentState.plants.map((p) =>
              p.id === updatedPlant.id ? updatedPlant : p
            );
            state.loadPlants(newPlants);
          };
        }

        selector.addEventListener("change", () => {
          renderEditForm(selector.value);
        });

        // Renderizar la planta seleccionada inicialmente
        renderEditForm(selector.value);
        break;

      default:
        content.innerHTML = `<p>Página no encontrada</p>`;
        break;
    }
  }
}

customElements.define("root-element", Root);

export default Root;
