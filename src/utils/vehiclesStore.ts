import fs from "fs";
import FuzzySearch from "fuzzy-search";

type Vehicle = {
  id: number;
  model: string;
  availability: string;
  range: string;
  efficiency: string;
  weight: string;
  acceleration: string;
  "1_stop_range": string;
  battery: string;
  fastcharge: string;
  towing: string;
  cargo_volume: string;
};

/* eslint-disable no-unused-vars */
// this is just interface method definitions, hence of course there will be unused vars
interface VehiclesStore {
  findById(id: number): Vehicle | undefined;
  list(): Vehicle[];
  find(query: { model: string }): Vehicle[];
}

/*
 * The commented code is the singleton pattern implementation of Omar's style
 * but Samy does not like it so we will do at his way because he is the boss and I can't say shit.
 */
class VehiclesJsonLoader implements VehiclesStore {
  // private static instance: VehiclesJsonLoader | null = null;

  private readonly vehicles: Vehicle[] = JSON.parse(fs.readFileSync("mock/vehicles.json", "utf8")) as Vehicle[];
  private readonly searchFuzzer = new FuzzySearch(this.vehicles, ["model"], { caseSensitive: false, sort: true });

  // private constructor() {}

  // static getInstance(): VehiclesJsonLoader {
  //     if (!VehiclesJsonLoader.instance) {
  //         VehiclesJsonLoader.instance = new VehiclesJsonLoader();
  //     }
  //     return VehiclesJsonLoader.instance;
  // }

  findById(id: number): Vehicle | undefined {
    return this.vehicles.find((vehicle) => vehicle.id === id);
  }

  list(): Vehicle[] {
    return this.vehicles;
  }

  find(query: { model: string }): Vehicle[] {
    return this.searchFuzzer.search(query.model);
  }
}

const fuzzySearcher = new VehiclesJsonLoader();

export { fuzzySearcher };
