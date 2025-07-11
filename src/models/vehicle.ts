import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from "typeorm";

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

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}
