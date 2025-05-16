import state from "../../flux/Store";
import type { Plant } from "../../services/Plants";

class GardenView extends HTMLElement {
  state = state;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state.subscribe(() => this.render());
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    const garden = this.state.getGarden();
    const plants = this.state.getPlants().filter((plant: Plant) => garden.plantIds.includes(plant.id));

    this.shadowRoot.innerHTML = `
      <style>
        h2 {
          font-family: Arial, sans-serif;
          text-align: center;
          margin-bottom: 10px;
        }
        .grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
        }
      </style>
      <h2>Jardín: ${garden.name}</h2>
      <div class="grid">
        ${plants
          .map(() => `<plant-card></plant-card>`)
          .join("")}

          
      </div>
    `;

    const cards = this.shadowRoot.querySelectorAll("plant-card");
    cards.forEach((card, i) => {
      (card as any).data = plants[i];
    });
  }
}

customElements.define("inicio-view", GardenView);
export default GardenView;
