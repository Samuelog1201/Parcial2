import { store } from '../flux/Store';
import Card, { Attribute } from '../components/Card/Card';
import { Plant, getPlants } from '../services/Plants';


class Root extends HTMLElement {
    cards: Card[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.loadData(); 
    }

    async loadData() {
        try {
            const products = await getPlants();

            products.forEach((plant: { img: string; commonName: string; scientificName: string }) => {
                const card = this.ownerDocument.createElement("my-card") as Card;
                card.setAttribute(Attribute.img, plant.img);
                card.setAttribute(Attribute.commonName, plant.commonName);
                card.setAttribute(Attribute.scientificName, plant.scientificName);
                this.cards.push(card);
            });

            this.render();
        } catch (error) {
            console.error("Error cargando plantas:", error);
        }
    }

    render() {
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                    padding: 1rem;
                }
            </style>
        `;

        this.cards.forEach(card => {
            this.shadowRoot!.appendChild(card);
        });
    }
}

customElements.define('root-element', Root);
export default Root