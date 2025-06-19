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

    @Column({ length: 6 })
    code: string;

    @Column({ default: false })
    used: boolean;

    @Column({
        type: "enum",
        enum: OTPType,
    })
    type: OTPType;

    @Column()
    expires_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne("User", "otps")
    @JoinColumn({ name: "user_id" })
    user: Relation<User>;
}
