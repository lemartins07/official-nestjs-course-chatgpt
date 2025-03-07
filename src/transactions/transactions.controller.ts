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
  Query,
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
  getAllTransactions(
    @Query('limit') limit: string = '10',
    @Query('page') page: string = '1',
  ) {
    return this.transactionService.findAll(Number(limit), Number(page));
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
    @Body() body: { type?: string; amount?: number; category?: string },
  ) {
    return this.transactionService.updateTransaction(Number(id), body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTransaction(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(Number(id));
  }
}
