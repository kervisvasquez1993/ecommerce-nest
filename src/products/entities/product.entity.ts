import { Column, PrimaryGeneratedColumn } from "typeorm"

export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column('text', {
        unique: true
    })
    title: string
    @Column('number', {
        default: 0
    })
    price: number
    @Column('text', {
        nullable: true
    })
    description: string
    @Column('text', {
        unique: true
    })
    slug: string
    @Column('int', { default: 0 })
    stock: number
    @Column('text', {
        array: true
    })
    size: string[]
    @Column('text')
    gender: string
}
