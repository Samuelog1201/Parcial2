import Store from '../../flux/Store'; // Ajusta la ruta según tu estructura
import type { Plant } from '../../services/Plants';

export enum Attribute {
  commonName = "common-name",
  scientificName = "scientific-name",
  img = "img",
  type = "type",
  origin = "origin",
  floweringSeason = "flowering-season",
  sunExposure = "sun-exposure",
  watering = "watering",
}

class Card extends HTMLElement {
  commonName?: string;
  scientificName?: string;
  img?: string;
  type?: string;
  origin?: string;
  floweringSeason?: string;
  sunExposure?: string;
  watering?: string;

  static get observedAttributes() {
    return Object.values(Attribute);
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleAddRemoveClick = this.handleAddRemoveClick.bind(this);
    this.handleDetailsClick = this.handleDetailsClick.bind(this);
  }

  attributeChangedCallback(name: string, _: string | null, newValue: string | null) {
    if (newValue !== null) {
      switch (name) {
        case Attribute.commonName:
          this.commonName = newValue;
          break;
        case Attribute.scientificName:
          this.scientificName = newValue;
          break;
        case Attribute.img:
          this.img = newValue;
          break;
        case Attribute.type:
          this.type = newValue;
          break;
        case Attribute.origin:
          this.origin = newValue;
          break;
        case Attribute.floweringSeason:
          this.floweringSeason = newValue;
          break;
        case Attribute.sunExposure:
          this.sunExposure = newValue;
          break;
        case Attribute.watering:
          this.watering = newValue;
          break;
      }
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  handleAddRemoveClick() {
    // Identificador de la planta - en este caso usaré commonName, ideal sería tener un id único
    // Pero como no lo tienes en atributos, usaré commonName (mejor si tienes id y lo añades)
    if (!this.commonName) return;

    const garden = Store.getGarden();
    const isInGarden = garden.plantIds.includes(this.commonName);

    if (isInGarden) {
      Store.removePlantFromGarden(this.commonName);
    } else {
      Store.addPlantToGarden(this.commonName);
    }
    this.render(); // Volver a renderizar para actualizar botón
  }

  handleDetailsClick() {
    if (!this.shadowRoot) return;
    // Crear modal de detalles
    const modal = document.createElement('div');
    modal.classList.add('modal-overlay');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.background = 'white';
    modalContent.style.borderRadius = '10px';
    modalContent.style.padding = '20px';
    modalContent.style.maxWidth = '400px';
    modalContent.style.textAlign = 'center';
    modalContent.style.position = 'relative';

    modalContent.innerHTML = `
      <h2>${this.commonName} (${this.scientificName})</h2>
      <img src="${this.img}" alt="${this.commonName}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
      <p><strong>Tipo:</strong> ${this.type}</p>
      <p><strong>Origen:</strong> ${this.origin}</p>
      <p><strong>Temporada de floración:</strong> ${this.floweringSeason}</p>
      <p><strong>Exposición al sol:</strong> ${this.sunExposure}</p>
      <p><strong>Riego:</strong> ${this.watering}</p>
      <button id="close-modal">Cerrar</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.querySelector('#close-modal')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Cerrar modal al click fuera del contenido
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  render() {
    if (!this.shadowRoot) return;

    // Usar commonName como id para añadir/quitar, ideal usar id real
    const garden = Store.getGarden();
    const isInGarden = this.commonName ? garden.plantIds.includes(this.commonName) : false;

    const imgTag = this.img
      ? `<img class="image-character" src="${this.img}" alt="${this.commonName || 'plant image'}">`
      : '';

    this.shadowRoot.innerHTML = `
      <style>
        section {
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 16px;
          max-width: 250px;
          text-align: center;
          font-family: Arial, sans-serif;
          background: white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        img.image-character {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
        h1 {
          font-size: 1.2rem;
          margin: 8px 0;
        }
        button {
          margin: 5px;
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        button#btn-add-remove {
          background-color: ${isInGarden ? '#e74c3c' : '#2ecc71'};
          color: white;
        }
        button#btn-details {
          background-color: #3498db;
          color: white;
        }
      </style>

      <section>
        ${imgTag}
        <h1>Nombre: ${this.commonName || ''}</h1>
        <h1>Nombre Científico: ${this.scientificName || ''}</h1>
        <button id="btn-add-remove">${isInGarden ? "Eliminar del Jardín" : "Añadir al Jardín"}</button>
        <button id="btn-details">Ver detalles</button>
      </section>
    `;

    this.shadowRoot.querySelector('#btn-add-remove')?.addEventListener('click', this.handleAddRemoveClick);
    this.shadowRoot.querySelector('#btn-details')?.addEventListener('click', this.handleDetailsClick);
  }
}

customElements.define("my-card", Card);
export default Card;
