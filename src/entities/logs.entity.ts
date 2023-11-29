import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('logs')
export class Logs {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  path: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  status_code: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  error_detail: string | undefined;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;
}
