import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  linkedId: number;

  @Column({ default: 'primary' })
  linkPrecedence: 'primary' | 'secondary';

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @CreateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  deletedAt: Date = null;
}
