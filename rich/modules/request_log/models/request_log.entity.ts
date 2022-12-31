import { CommonEntity } from "../../common/models/common.entity";
import { User } from "../../user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity("request_logs")
export class RequestLog extends CommonEntity {

        @Column({ nullable: true })
        name: string

        @Column({ nullable: true })
        url: string

        @Column({ nullable: true })
        status: number

        @Column({ nullable: true })
        method: string

        @Column({ nullable: true })
        userAgent: string

        @Column({ nullable: true })
        contentLength: string

        @Column({ nullable: true })
        ip: string

        @ManyToOne(type => User, user => user.id)
        @JoinColumn({ name: 'user_id' })
        user: User;

}