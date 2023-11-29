import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('sites')
export class Sites {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 100,
  })
  sites_name: string;
  @Column({
    type: 'varchar',
    length: 100,
  })
  sites_code: string;
  description: string | undefined;
}
