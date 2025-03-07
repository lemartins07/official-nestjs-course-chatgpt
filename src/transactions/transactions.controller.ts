import { Controller, Get, Param } from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  private transactions = [
    { id: 1, type: 'expense', amount: 100, category: 'Food' },
    { id: 2, type: 'income', amount: 500, category: 'Salary' },
  ];

  @Get()
  getAllTransactions() {
    return this.transactions;
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    const transaction = this.transactions.find((t) => t.id === Number(id));
    if (!transaction) {
      return { message: 'Transaction not found' };
    }
    return transaction;
  }
}
