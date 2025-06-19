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

    @Column()
    expires_at: Date;

    @Column({ nullable: true })
    revoked_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.tokens)
    @JoinColumn({ name: "user_id" })
    user: Relation<User>;
}
