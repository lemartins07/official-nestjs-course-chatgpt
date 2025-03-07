import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
  private transactions = [
    { id: 1, type: 'expense', amount: 100, category: 'Food' },
    { id: 2, type: 'income', amount: 500, category: 'Salary' },
    { id: 3, type: 'expense', amount: 200, category: 'Shopping' },
    { id: 4, type: 'expense', amount: 50, category: 'Transport' },
    { id: 5, type: 'income', amount: 1000, category: 'Freelance' },
    { id: 6, type: 'expense', amount: 300, category: 'Health' },
  ];

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllTransactions(
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '1',
  ) {
    const pageSize = Number(limit);
    const pageNumber = Number(page);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      total: this.transactions.length,
      page: pageNumber,
      limit: pageSize,
      data: this.transactions.slice(startIndex, endIndex),
    };
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

  @Put(':id')
  updateTransaction(
    @Param('id') id: string,
    @Body() body: { type?: string; amount?: number; category?: string },
  ) {
    const transactionIndex = this.transactions.findIndex(
      (t) => t.id === Number(id),
    );
    if (transactionIndex === -1) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    this.transactions[transactionIndex] = {
      ...this.transactions[transactionIndex],
      ...body,
    };
    return this.transactions[transactionIndex];
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTransaction(@Param('id') id: string) {
    const transactionIndex = this.transactions.findIndex(
      (t) => t.id === Number(id),
    );
    if (transactionIndex === -1) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    this.transactions.splice(transactionIndex, 1);
  }
}
