import { Column, PrimaryGeneratedColumn } from "typeorm"

export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column('text', {
        unique: true
    })
    title: string
}
