import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    ManyToOne,
    type Relation,
    JoinColumn,
} from "typeorm";
import { TransactionStatus } from "../schemas/transction.js";
import { User } from "./user.js";

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

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @ManyToOne(() => User, (user) => user.transactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: Relation<User>;
}
