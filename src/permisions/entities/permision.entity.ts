import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('permisions')
export class Permision {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
  })
  user_id: number;

  @Column({
    type: 'varchar',
    length: 30,
  })
  permision_name: string;

  @Column({
    type: 'boolean',
  })
  value: boolean;
}
