import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CommonEntity {

        @PrimaryGeneratedColumn()
        id: string

        @UpdateDateColumn()
        updated_at: string

        @CreateDateColumn()
        created_at: string

}