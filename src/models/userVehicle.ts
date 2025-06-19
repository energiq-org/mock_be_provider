import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Unique,
} from "typeorm";
import type { Relation } from "typeorm";
import { User } from "./user.js";
import { Vehicle } from "./vehicle.js";
import { ConnectorTypeEnum } from "../schemas/userVehicles.js";

@Entity("user_vehicles")
@Unique(["user_id", "vehicle_id"])
export class UserVehicle extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    user_id: string;

    @Column()
    vehicle_id: number;

    @Column({
        type: "enum",
        enum: ConnectorTypeEnum,
    })
    connector_type: string;

    @Column()
    actual_battery: string;

    @CreateDateColumn({ type: "timestamptz"})
    created_at: Date;

    @ManyToOne(() => User, (user) => user.vehicles)
    @JoinColumn({ name: "user_id" })
    user: Relation<User>;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.users)
    @JoinColumn({ name: "vehicle_id" })
    vehicle: Relation<Vehicle>;
}
