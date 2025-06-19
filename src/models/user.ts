import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    BaseEntity,
    JoinColumn,
    type Relation,
} from "typeorm";
import { Token } from "./token.js";
import { OTP } from "./OTP.js";
import { UserVehicle } from "./userVehicle.js";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    email_verified: boolean;

    @Column({ nullable: true })
    phone_number: string;

    @Column({ type: "text", nullable: true })
    profile_picture: string;

    @CreateDateColumn({ type: "timestamptz"})
    created_at: Date;

    @OneToMany(() => Token, (token) => token.user)
    @JoinColumn({ name: "user_id" })
    tokens!: Relation<Token>[];

    @OneToMany(() => OTP, (otp) => otp.user)
    @JoinColumn({ name: "user_id" })
    otps!: Relation<OTP>[];

    @OneToMany(() => UserVehicle, (userVehicle) => userVehicle.user)
    vehicles: Relation<UserVehicle>[];

    async getVehiclesTransformed(): Promise<
        Array<{
            id: string;
            model: string;
            availability: string;
            range: string;
            efficiency: string;
            weight: string;
            acceleration: string;
            one_stop_range: string;
            battery: string;
            fastcharge: string;
            towing: string;
            cargo_volume: string;
            connector_type: string;
            actual_battery: string;
            created_at: Date;
        }>
    > {
        const userVehicles = await UserVehicle.find({
            where: { user_id: this.id },
            relations: ["vehicle"],
        });

        return userVehicles.map((uv) => {
            const { vehicle, ...userVehicleData } = uv;
            return {
                ...vehicle,
                ...userVehicleData,
            };
        });
    }
}

/*
 * We used to have updated_at column in the table because Samy likes keeping track of stuff
 * but no body gives a shit about it hence it was nuked by me
 */
