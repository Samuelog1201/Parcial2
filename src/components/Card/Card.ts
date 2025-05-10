export enum Attribute {
    "commonName" = "commonName",
    "scientificName" = "scientificName",
    "img" = "img",
    "type" = "type",
    "origin" = "origin",
    "floweringSeason" = "floweringSeason",
    "sunExposure" = "sunExposure",
    "watering" = "watering",
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
    }

    attributeChangedCallback(propName: string, _: string, newValue: string) {
        switch (propName) {
            case Attribute.img:
                this.img = newValue;
                break;
            case Attribute.commonName:
                this.commonName = newValue;
                break;
            case Attribute.scientificName:
                this.scientificName = newValue;
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

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

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

                .button {
                    margin-top: 12px;
                    padding: 8px 12px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .button:hover {
                    background-color: #45a049;
                }
            </style>

            <section>
                <img class="image-character" src="${this.img || ''}" alt="${this.commonName || 'plant image'}">
                <h1>Nombre: ${this.commonName || ''}</h1>
                <h1>Nombre Cientifico: ${this.scientificName || ''}</h1>
                <button class="button">View Details</button>
            </section>
        `;
    }
}

customElements.define("my-card", Card);
export default Card;
