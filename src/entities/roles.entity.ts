import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('security_role')
export class SecurityRole {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  role_name: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  role_code: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  description: string | undefined;
}
