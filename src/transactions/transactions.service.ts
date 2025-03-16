import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { CurrencyService } from 'src/currency/currency.service';

interface ExchangeRateProvider {
  getRate: (currency: string) => number;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly currencyService: CurrencyService,
    @Inject('EXCHANGE_RATE_PROVIDER')
    private readonly exchangeRateProvider: ExchangeRateProvider,
  ) {}

  async findAll(
    page: number,
    limit: number = 10,
    currency?: string,
  ): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.transactionRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
      relations: ['user'],
    });

    if (currency) {
      const rate = this.exchangeRateProvider.getRate(currency);
      data.forEach((transaction) => {
        transaction.amount = parseFloat((transaction.amount * rate).toFixed(2));
      });
    }

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const newTransaction =
      this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(newTransaction);
  }

  async updateTransaction(
    id: number,
    updateData: Partial<CreateTransactionDto>,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.preload({
      id,
      ...updateData,
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return await this.transactionRepository.save(transaction);
  }

  async deleteTransaction(id: number): Promise<void> {
    const result = await this.transactionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}
