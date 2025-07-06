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
import { UserVehicle } from "./userVehicle.js";
import { Session } from "./sessions.js";
import { Transaction } from "./transaction.js";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text", nullable: true })
    profile_picture: string;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @OneToMany(() => UserVehicle, (userVehicle) => userVehicle.user, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    vehicles: Relation<UserVehicle>[];

    @OneToMany(() => Session, (session) => session.user, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    sessions: Relation<Session>[];

    @OneToMany(() => Transaction, (transaction) => transaction.user, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    transactions: Relation<Transaction>[];

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
