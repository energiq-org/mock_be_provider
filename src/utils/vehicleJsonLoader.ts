import fs from "fs";
import { vehicleSchema } from "../schemas/vehicles.js";
import { Static } from "@sinclair/typebox";
import { IVehiclesStore } from "../interfaces/vehicleStore.js";

type Vehicle = Static<typeof vehicleSchema>;

class VehiclesJsonLoader implements IVehiclesStore {
  private vehicles: Vehicle[] = [];

  constructor() {
    this.vehicles = JSON.parse(fs.readFileSync("mock/vehicles.json", "utf8")) as Vehicle[];
  }

  findById(id: number): Vehicle | null {
    return this.vehicles.find((vehicle) => vehicle.id === id) ?? null;
  }

  list(): Vehicle[] {
    return this.vehicles;
  }

  find(query: { model: string }): Vehicle[] {
    return this.vehicles.filter((vehicle) => vehicle.model.toLowerCase().includes(query.model.toLowerCase()));
  }
}

export { VehiclesJsonLoader };
