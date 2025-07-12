import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Station } from "./station.js";

export enum SessionStatus {
    PAID = "Paid",
    IN_PROGRESS = "In Progress",
    FAILED = "Failed"
}

export enum PaymentMethod {
    CREDIT_CARD = "Credit Card",
    WALLET = "Wallet", 
    SUBSCRIPTION = "Subscription",
    CASH = "Cash"
}

@Entity("sessions")
export class Session extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    station_id: number;

    @ManyToOne(() => Station)
    @JoinColumn({ name: "station_id" })
    station: Station;

    @Column({
        type: "enum",
        enum: SessionStatus,
        default: SessionStatus.IN_PROGRESS
    })
    status: SessionStatus;

    @Column({ nullable: true })
    user_id: string; // External user reference - email or "Guest"

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    energy_delivered: number; // kWh

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    cost: number; // in currency (EGP)

    @Column({ nullable: true })
    start_time: Date;

    @Column({ nullable: true })
    end_time: Date;

    @Column({ default: 0 })
    duration_minutes: number;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    success_rate: number; // percentage

    @Column({ default: false })
    plug_in_successful: boolean;

    @Column({ nullable: true })
    charger_id: string;

    @Column({ nullable: true })
    connector_id: string; // e.g., "Type 2 - Port 1"

    @Column({
        type: "enum",
        enum: PaymentMethod,
        default: PaymentMethod.CREDIT_CARD
    })
    payment_method: PaymentMethod;

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    peak_power: number; // kW

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    average_power: number; // kW

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
} 