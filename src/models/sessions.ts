import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    JoinColumn,
    type Relation,
    ManyToOne,
} from "typeorm";
import { User } from "./user.js";

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

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: Relation<User>;
}
