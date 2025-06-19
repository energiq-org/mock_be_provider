import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from "typeorm";

@Entity("sessions")
export class Session extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    user_id: string;

    @Column("uuid")
    vehicle_id: string;

    @Column("int")
    duration: number;

    @Column("int")
    kw_consumed: number;

    @CreateDateColumn()
    created_at: Date;
}
