import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()


export class PriceLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    symbol: string;

    @Column('decimal',({ precision: 18, scale: 8 }))   
    price: string;

    @Column({ default: 'Binance' })
    source: string;
    

    @CreateDateColumn()
    createdAt: Date;
}
