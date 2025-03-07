import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest_finance',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
