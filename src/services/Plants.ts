import rawData from '../data/data.json';

export interface Plant {
  id: string;
  img: string;
  commonName: string; 
  scientificName: string;
  type: string;
  origin: string;
  floweringSeason: string;
  sunExposure: string;
  watering: string;
}

export function getPlants(): Plant[] {
  return rawData.map((plant: any, index: number) => ({
    id: index.toString(),
    img: plant.img,
    commonName: plant.common_name,
    scientificName: plant.scientific_name,
    type: plant.type,
    origin: plant.origin,
    floweringSeason: plant.flowering_season,
    sunExposure: plant.sun_exposure,
    watering: plant.watering,
  }));
}
