import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';


@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column("text", {
        unique: true
    })
    email: string;
    @Column("text", {
        select: false
    })
    password: string;
    @Column("text")
    fullName: string;
    @Column("bool", {
        default: false
    })
    isActive: boolean;
    @Column("text", {
        array: true,
        default: []
    })
    roles: string[]
}
