import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
} from "typeorm";
import { TransactionStatus } from "../schemas/transction.js";

@Entity("transactions")
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: TransactionStatus,
    })
    status: TransactionStatus;

    @Column("bigint")
    amount: string; // Changed to string as TypeORM handles bigint as string

    @Column("uuid")
    session_id: string;

    @Column("uuid")
    user_id: string;

    @Column("uuid")
    vehicle_id: string;

    @CreateDateColumn()
    created_at: Date;
}
