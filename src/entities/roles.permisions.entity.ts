import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('security_role_permisions')
export class SecurityRolePermisions {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
  })
  role_id: number;

  @Column({
    type: 'int',
  })
  permission_id: number;
}
