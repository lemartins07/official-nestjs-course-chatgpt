import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, transactions } = createUserDto;
    const user = new User();
    user.email = email;
    user.password = password;

    if (transactions && transactions.length > 0) {
      user.transactions = transactions.map((transactionsDto) => {
        const transaction = new Transaction();
        transaction.type = transactionsDto.type;
        transaction.amount = transactionsDto.amount;
        transaction.category = transactionsDto.category;
        return transaction;
      });
    }
    return await this.userRepository.save(user);
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
