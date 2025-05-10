import { IVehiclesStore } from "../interfaces/vehicleStore.js";
import { VehiclesDBLoader } from "./vehicleDBLoader.js";
import FuzzySearch from "fuzzy-search";
import { VehicleSchemaType } from "../schemas/vehicles.js";

class FuzzySearcher {
  store!: IVehiclesStore;
  private static instance: FuzzySearcher;
  private fuzzy!: FuzzySearch<VehicleSchemaType>;
  private static isFuzzyInitialized = false;

  constructor(store: IVehiclesStore) {
    if (FuzzySearcher.instance !== undefined) {
      return FuzzySearcher.instance;
    }
    this.store = store;

    return FuzzySearcher.instance;
  }

  private initializeFuzzy() {
    this.fuzzy = new FuzzySearch(this.store.list(), ["model"], { caseSensitive: false, sort: true });
  }

  setStore(store: IVehiclesStore) {
    this.store = store;
  }

  search(query: { model: string }): VehicleSchemaType[] {
    if (!FuzzySearcher.isFuzzyInitialized) {
      this.initializeFuzzy();
    }
    return this.fuzzy.search(query.model);
  }
}

const fuzzySearcher = new FuzzySearcher(new VehiclesDBLoader());
export { fuzzySearcher };
