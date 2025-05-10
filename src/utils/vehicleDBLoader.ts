import { VehicleSchemaType } from "../schemas/vehicles.js";
import { IVehiclesStore } from "../interfaces/vehicleStore.js";

import { Vehicle } from "../models/vehicle.js";

// this is a singleton class that loads the vehicles from the database and provides a store of vehicles
// Assumes that the vehicles are already in the database and that the database is already seeded

class VehiclesDBLoader implements IVehiclesStore {
  private vehicles: VehicleSchemaType[] = [];

  constructor() {
    void this.fetchVehicles();
  }

  private async fetchVehicles() {
    this.vehicles = await Vehicle.findAll();
  }

  findById(id: number) {
    return this.vehicles.find((vehicle) => vehicle.id === id) ?? null;
  }

  list() {
    return this.vehicles ?? [];
  }

  find(query: { model: string }) {
    return this.vehicles.filter((vehicle) => vehicle.model.toLowerCase().includes(query.model.toLowerCase())) ?? [];
  }
}

export { VehiclesDBLoader };
