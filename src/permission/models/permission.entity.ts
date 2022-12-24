import { CommonEntity } from "src/common/models/common.entity";
import { Column, Entity } from "typeorm";

@Entity("permissions")
export class Permission extends CommonEntity {

        @Column()
        name: string

        @Column()
        pattern: string

}