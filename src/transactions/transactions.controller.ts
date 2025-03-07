import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  private transactions = [
    { id: 1, type: 'expense', amount: 100, category: 'Food' },
    { id: 2, type: 'income', amount: 500, category: 'Salary' },
  ];

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllTransactions() {
    return this.transactions;
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    const transaction = this.transactions.find((t) => t.id === Number(id));
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTransaction(
    @Body() body: { type: string; amount: number; category: string },
  ) {
    const newTransaction = {
      id: this.transactions.length + 1,
      ...body,
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }
}
