import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    type Relation,
} from "typeorm";
import { User } from "./user.js";

@Entity("tokens")
export class Token extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    user_id: string;

    @Column()
    refresh_token: string;

    @Column({ type: "timestamptz"})
    expires_at: Date;

    @Column({ type: "timestamptz", nullable: true })
    revoked_at: Date;

    @CreateDateColumn({type: "timestamptz"})
    created_at: Date;

    @ManyToOne(() => User, (user) => user.tokens)
    @JoinColumn({ name: "user_id" })
    user: Relation<User>;
}
