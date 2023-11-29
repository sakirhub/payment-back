import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity('users')
export class User {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 30,
  })
  name: string;
  @Column({
    unique: true,
    type: 'varchar',
    length: 70,
  })
  email: string;
  @Column()
  email_verified_at: Date;
  @Exclude()
  @Column()
  password: string;
  @Exclude()
  @Column({
    nullable: true,
  })
  remember_token: string;
  @Exclude()
  @Column({
    nullable: true,
  })
  two_factor_secret: string;
  @Exclude()
  @Column({
    nullable: true,
  })
  two_factor_recovery_codes: string;
  @Column({
    nullable: true,
    default:
      'https://cdn.icon-icons.com/icons2/2468/PNG/512/user_kids_avatar_user_profile_icon_149314.png',
  })
  profile_photo_path: string;
  @Column({
    nullable: true,
    type: 'integer',
    default: 0,
  })
  created_by: number;
  @Column({
    nullable: false,
    type: 'integer',
  })
  role_id: number;

  @Column({
    nullable: true,
  })
  group_id: string;

  @Column({
    nullable: true,
  })
  site_id: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;
  @Column({
    nullable: true,
    type: 'timestamp',
  })
  updated: Date;
  @Column({
    nullable: true,
    type: 'timestamp',
  })
  deleted: Date;
}
