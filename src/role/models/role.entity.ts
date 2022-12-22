import { CommonEntity } from "src/common/models/common.entity";
import { Permission } from "src/permission/models/permission.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity("roles")
export class Role extends CommonEntity {

        @Column()
        name: string;


        @ManyToMany(() => Permission, { cascade: true })
        @JoinTable({
                name: "roles_permissions",
                joinColumn: { name: "role_id", referencedColumnName: "id" },
                inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" }
        })
        permissions: Permission[]

}