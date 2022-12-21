import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("users")
export class User {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        name: string;

        @Column()
        email: string;

        @Column()
        @Exclude()
        password: string;
}