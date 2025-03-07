import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  private transactions = [
    { id: 1, type: 'expense', amount: 100, category: 'Food' },
    { id: 2, type: 'income', amount: 500, category: 'Salary' },
    { id: 3, type: 'expense', amount: 200, category: 'Shopping' },
    { id: 4, type: 'expense', amount: 50, category: 'Transport' },
    { id: 5, type: 'income', amount: 1000, category: 'Freelance' },
    { id: 6, type: 'expense', amount: 300, category: 'Health' },
  ];

  findAll(limit: number, page: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      total: this.transactions.length,
      page,
      limit,
      data: this.transactions.slice(startIndex, endIndex),
    };
  }

  findOne(id: number) {
    const transaction = this.transactions.find((t) => t.id === id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  createTransaction(data: { type: string; amount: number; category: string }) {
    const newTransaction = {
      id: this.transactions.length + 1,
      ...data,
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  updateTransaction(
    id: number,
    data: { type?: string; amount?: number; category?: string },
  ) {
    const transactionIndex = this.transactions.findIndex((t) => t.id === id);
    if (transactionIndex === -1) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    this.transactions[transactionIndex] = {
      ...this.transactions[transactionIndex],
      ...data,
    };
    return this.transactions[transactionIndex];
  }

  deleteTransaction(id: number) {
    const transactionIndex = this.transactions.findIndex((t) => t.id === id);
    if (transactionIndex === -1) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    this.transactions.splice(transactionIndex, 1);
  }
}
