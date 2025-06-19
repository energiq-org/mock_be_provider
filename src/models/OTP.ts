import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    JoinColumn,
    ManyToOne,
    type Relation,
} from "typeorm";
import { OTPType } from "../schemas/OTP.js";
import { User } from "./user.js";

@Entity("otps")
export class OTP extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    user_id: string;

    @Column()
    email: string;

    @Column({ length: 20 })
    code: string;

    @Column({ default: false })
    used: boolean;

    @Column({
        type: "enum",
        enum: OTPType,
    })
    type: OTPType;

    @Column({ type: "timestamptz" })
    expires_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @ManyToOne("User", "otps")
    @JoinColumn({ name: "user_id" })
    user: Relation<User>;
}
