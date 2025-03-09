import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
@Index(['user']) // 📌 Índice para otimizar buscas por usuário
@Index(['type', 'created_at']) // 📌 Índice composto para filtrar por tipo e data
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @Index() // 📌 Criando índice diretamente no relacionamento
  user: User;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
