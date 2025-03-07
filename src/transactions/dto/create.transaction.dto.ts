import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsEnum(['income', 'expense'], {
    message: 'Type must be either income or expense',
  })
  @IsNotEmpty()
  type: 'income' | 'expense';

  @IsNumber()
  @Min(1, { message: 'Amount must be greater than 0' })
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;
}
