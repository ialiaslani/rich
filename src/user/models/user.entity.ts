import { Exclude } from "class-transformer";
import { CommonEntity } from "src/common/models/common.entity";
import { Role } from "src/role/models/role.entity";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm"

@Entity("users")
export class User extends CommonEntity {

        @Column()
        name: string;

        @Column()
        email: string;

        @Column({ default: "ACTIVE" })
        status: "ACTIVE" | "DEACTIVE" | "BLOCKED";

        @Column({ nullable: true })
        image: string;

        @Column()
        @Exclude()
        password: string;


        @ManyToMany(() => Role, { cascade: true })
        @JoinTable({
                name: "users_roles",
                joinColumn: { name: "user_id", referencedColumnName: "id" },
                inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
        })
        roles: Role[]
}