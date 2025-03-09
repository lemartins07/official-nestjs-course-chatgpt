import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password') // 👈 Aqui carregamos a senha manualmente apenas quando necessário
      .getOne();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, transactions } = createUserDto;

    return await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, { email, password });
      await manager.save(user);

      if (transactions && transactions.length > 0) {
        const transactionEntities = transactions.map((transactionDto) =>
          manager.create(Transaction, { ...transactionDto, user }),
        );
        await manager.save(transactionEntities);
      }

      const userWithTransactions = await manager.findOne(User, {
        where: { id: user.id },
        relations: ['transactions'],
      });

      if (!userWithTransactions) {
        throw new Error('User not found after creation');
      }

      return userWithTransactions;
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }

    if (updateUserDto.transactions) {
      for (const transactionDto of updateUserDto.transactions) {
        const existingTransaciton = await this.transactionRepository.findOne({
          where: { id: transactionDto.id },
        });

        if (!existingTransaciton) {
          throw new NotFoundException(
            `Transaction with ID ${transactionDto.id} not found`,
          );
        }

        Object.assign(existingTransaciton, transactionDto);
        await this.transactionRepository.save(existingTransaciton);
      }
    }

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
