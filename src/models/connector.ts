import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";

export enum ConnectorType {
    TYPE_1 = "Type 1",
    TYPE_2 = "Type 2",
    CHADEMO = "CHAdeMO",
    CCS = "CCS",
    TESLA = "Tesla"
}

export enum ConnectorStatus {
    AVAILABLE = "Available",
    OCCUPIED = "Occupied",
    FAULTED = "Faulted",
    OFFLINE = "Offline",
    MAINTENANCE = "Maintenance"
}

@Entity("connectors")
export class Connector extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    connector_id: string; // External connector identifier

    @Column()
    charger_id: number;

    @ManyToOne("Charger", "connectors", { onDelete: "CASCADE" })
    @JoinColumn({ name: "charger_id" })
    charger: any;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: ConnectorType
    })
    type: ConnectorType;

    @Column({
        type: "enum",
        enum: ConnectorStatus,
        default: ConnectorStatus.AVAILABLE
    })
    status: ConnectorStatus;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    max_power: number; // kW

    @Column({ type: "decimal", precision: 5, scale: 2 })
    min_power: number; // kW

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
    metadata: Record<string, unknown>; // Additional connector data

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
} 