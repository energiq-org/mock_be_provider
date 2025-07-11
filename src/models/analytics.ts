import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

export enum TimePeriod {
    THIS_WEEK = "thisWeek",
    LAST_WEEK = "lastWeek",
    THIS_MONTH = "thisMonth",
    LAST_MONTH = "lastMonth"
}

export enum MetricType {
    DAILY_SESSIONS = "dailySessions",
    DAILY_ENERGY = "dailyEnergy", 
    HOURLY_USAGE = "hourlyUsage",
    STATION_PERFORMANCE = "stationPerformance",
    REVENUE_SUMMARY = "revenueSummary"
}

@Entity("analytics")
export class Analytics extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: MetricType
    })
    metric_type: MetricType;

    @Column({
        type: "enum",
        enum: TimePeriod
    })
    time_period: TimePeriod;

    @Column()
    date: Date; // The date this metric represents

    @Column({ type: "json" })
    data: Record<string, unknown>; // The actual metric data

    // Dashboard summary metrics
    @Column({ default: 0 })
    total_stations: number;

    @Column({ default: 0 })
    online_stations: number;

    @Column({ default: 0 })
    offline_stations: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total_revenue: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    total_energy_delivered: number;

    @Column({ default: 0 })
    total_sessions: number;

    @Column({ default: 0 })
    active_alerts: number;

    @Column({ default: 0 })
    critical_alerts: number;

    // Performance metrics
    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    plug_in_success_rate: number; // percentage

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    average_session_duration: number; // minutes

    @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
    utilization_rate: number; // percentage

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
} 