import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('groups')
export class Groups {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 100,
  })
  group_name: string;
  @Column({
    type: 'varchar',
    length: 100,
  })
  group_code: string;
  description: string | undefined;
}
