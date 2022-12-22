import { CommonEntity } from "src/common/models/common.entity";
import { Column, Entity } from "typeorm";

@Entity("request_logs")
export class RequestLog extends CommonEntity  {

        @Column()
        name: string

        @Column()
        path: string

}