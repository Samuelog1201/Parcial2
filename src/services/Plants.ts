// TODO: arregla typos de "error", maneja caso de error y exito
export interface Plant {
    img: string;
    commonName: string;
    scientificName: string;
    type?: string;
    origin?: string;
    floweringSeason?: string;
    sunExposure?: string;
    watering?: string;
}

export async function getPlants(): Promise<Plant[]> {
    try {
        const response = await fetch(`http://192.168.131.101:8080/dca/api/plants`);

        if (!response.ok) {
            console.error(`Error al obtener plantas: ${response.status} ${response.statusText}`);
            return [];
        }

        const plants: Plant[] = await response.json();
        console.log("Plantas obtenidas con éxito:", plants);
        return plants;
    } catch (error) {
        console.error("Error al obtener plantas:", error);
        return [];
    }
}
