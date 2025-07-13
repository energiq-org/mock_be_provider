import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn, OneToMany } from "typeorm";

export enum ChargerType {
    AC = "AC",
    DC = "DC"
}

export enum ChargerStatus {
    AVAILABLE = "Available",
    OCCUPIED = "Occupied",
    FAULTED = "Faulted",
    OFFLINE = "Offline",
    MAINTENANCE = "Maintenance"
}

@Entity("chargers")
export class Charger extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    charger_id: string; // External charger identifier

    @Column()
    station_id: number;

    @ManyToOne("Station", "chargers", { onDelete: "CASCADE" })
    @JoinColumn({ name: "station_id" })
    station: any;

    @OneToMany("Connector", "charger", { cascade: true })
    connectors: any[];

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: ChargerType
    })
    type: ChargerType;

    @Column({
        type: "enum",
        enum: ChargerStatus,
        default: ChargerStatus.AVAILABLE
    })
    status: ChargerStatus;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    max_power: number; // kW

    @Column({ type: "decimal", precision: 5, scale: 2 })
    min_power: number; // kW

    @Column({ default: 0 })
    connectors_count: number;

    @Column({ default: 0 })
    active_sessions: number;

    @Column({ default: 0 })
    total_sessions: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total_energy_delivered: number; // kWh

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total_revenue: number; // in currency

    @Column({ nullable: true })
    last_maintenance: Date;

    @Column({ nullable: true })
    next_maintenance: Date;

    @Column({ type: "json", nullable: true })
    metadata: Record<string, unknown>; // Additional charger data

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
} 