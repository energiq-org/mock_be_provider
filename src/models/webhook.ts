import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
} from "typeorm";

@Entity("webhooks")
export class Webhook extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    success: boolean;

    @Column("jsonb")
    content: object;

    @CreateDateColumn({ type: "timestamptz"})
    created_at: Date;
}
