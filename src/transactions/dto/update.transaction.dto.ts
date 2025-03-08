import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsNotEmpty()
  id: number; // O ID da transação é obrigatório para garantir que estamos atualizando um registro existente

  @IsOptional()
  @IsEnum(['income', 'expense'], {
    message: 'Type must be either income or expense',
  })
  type?: 'income' | 'expense';

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Amount must be greater than 0' })
  amount?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
