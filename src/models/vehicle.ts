import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BaseEntity, Relation } from "typeorm";
import { UserVehicle } from "./userVehicle.js";

@Entity("vehicles")
export class Vehicle extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    model: string;

    @Column()
    availability: string;

    @Column()
    range: string;

    @Column()
    efficiency: string;

    @Column()
    weight: string;

    @Column()
    acceleration: string;

    @Column()
    one_stop_range: string;

    @Column()
    battery: string;

    @Column()
    fastcharge: string;

    @Column()
    towing: string;

    @Column()
    cargo_volume: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => UserVehicle, (userVehicle) => userVehicle.vehicle)
    users: Relation<UserVehicle>[];
}
