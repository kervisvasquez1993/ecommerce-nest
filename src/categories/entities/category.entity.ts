import { Product } from 'src/products/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    descriptions: string;

    @Column({ nullable: true })
    imagen: string;

    @Column({ nullable: true })
    id_padre: number;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}
