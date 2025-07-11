import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Station } from "./station.js";

export enum AlertSeverity {
    LOW = "Low",
    MEDIUM = "Medium", 
    HIGH = "High",
    CRITICAL = "Critical"
}

export enum AlertStatus {
    ACTIVE = "Active",
    ACKNOWLEDGED = "Acknowledged",
    RESOLVED = "Resolved",
    DISMISSED = "Dismissed"
}

export enum AlertType {
    STATION_OFFLINE = "Station Offline",
    OVERHEATING = "Overheating",
    POWER_FAILURE = "Power Failure",
    CHARGER_FAULT = "Charger Fault",
    CONNECTOR_FAULT = "Connector Fault",
    NETWORK_ISSUE = "Network Issue",
    NETWORK_DISCONNECTED = "Network Disconnected",
    MAINTENANCE_DUE = "Maintenance Due",
    MAINTENANCE_REQUIRED = "Maintenance Required",
    REVENUE_ANOMALY = "Revenue Anomaly",
    HIGH_USAGE = "High Usage",
    LOW_BATTERY = "Low Battery",
    COMMUNICATION_ERROR = "Communication Error",
    TEMPERATURE_WARNING = "Temperature Warning"
}

@Entity("alerts")
export class Alert extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    station_id: number;

    @ManyToOne(() => Station)
    @JoinColumn({ name: "station_id" })
    station: Station;

    @Column({
        type: "enum",
        enum: AlertType
    })
    type: AlertType;

    @Column({
        type: "enum",
        enum: AlertSeverity,
        default: AlertSeverity.MEDIUM
    })
    severity: AlertSeverity;

    @Column({
        type: "enum", 
        enum: AlertStatus,
        default: AlertStatus.ACTIVE
    })
    status: AlertStatus;

    @Column()
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column({ nullable: true })
    charger_id: string;

    @Column({ nullable: true })
    connector_id: string;

    @Column({ nullable: true })
    acknowledged_by: string; // User ID who acknowledged

    @Column({ nullable: true })
    acknowledged_at: Date;

    @Column({ nullable: true })
    resolved_at: Date;

    @Column({ nullable: true })
    resolved_by: string; // User ID who resolved

    @Column({ type: "json", nullable: true })
    metadata: Record<string, unknown>; // Additional alert data

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
} 