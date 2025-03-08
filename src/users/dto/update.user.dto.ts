import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateTransactionDto } from 'src/transactions/dto/update.transaction.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Garante validação de cada transação separadamente
  @Type(() => UpdateTransactionDto) // Usa o DTO correto para transações
  transactions?: UpdateTransactionDto[];
}
