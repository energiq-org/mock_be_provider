import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";

export enum StationStatus {
    ONLINE = "Online",
    OFFLINE = "Offline", 
    DEGRADED = "Degraded"
}

@Entity("stations")
export class Station extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany("Charger", "station", { cascade: true })
    chargers: any[];

    @Column()
    name: string;

    @Column()
    location: string;

    @Column({
        type: "enum",
        enum: StationStatus,
        default: StationStatus.OFFLINE
    })
    status: StationStatus;

    @Column()
    power: string; // e.g., "50 kW", "150 kW"

    @Column({ default: 0 })
    active_sessions: number;

    @Column({ default: 0 })
    total_sessions: number;

    @Column({ default: 0 })
    alerts_count: number;

    @Column({ type: "decimal", precision: 10, scale: 7 })
    latitude: number;

    @Column({ type: "decimal", precision: 10, scale: 7 })
    longitude: number;

    @Column({ nullable: true })
    last_seen: Date;

    @Column({ default: 0 })
    chargers_count: number;

    @Column({ default: 0 })
    connectors_count: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total_energy_delivered: number; // kWh

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total_revenue: number; // in currency

    @Column({ type: "json", nullable: true })
    operating_hours: Record<string, unknown>; // Operating hours data

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
} 