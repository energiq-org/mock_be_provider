import { VehicleSchemaType } from "../schemas/vehicles.js";

/* eslint-disable no-unused-vars */
// this is just interface method definitions, hence of course there will be unused vars

interface IVehiclesStore {
  findById(id: number): VehicleSchemaType | null;
  list(): VehicleSchemaType[] | [];
  find(query: { model: string }): VehicleSchemaType[] | [];
}

export { IVehiclesStore };
