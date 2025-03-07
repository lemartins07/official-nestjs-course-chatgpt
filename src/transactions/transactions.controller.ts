import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create.transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllTransactions() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  getTransactionById(@Param('id') id: string) {
    return this.transactionService.findOne(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createTransaction(@Body() body: CreateTransactionDto) {
    return this.transactionService.createTransaction(body);
  }

  @Put(':id')
  updateTransaction(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTransactionDto>,
  ) {
    return this.transactionService.updateTransaction(Number(id), updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTransaction(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(Number(id));
  }
}
