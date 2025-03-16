import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';

interface ExchangeRateProvider {
  getRate: (currency: string) => number;
}

@Module({
  providers: [
    CurrencyService,
    {
      provide: 'EXCHANGE_RATE_PROVIDER',
      useFactory: (): ExchangeRateProvider => {
        const rates: Record<string, number> = {
          USD: 1.0,
          EUR: 0.92,
          BRL: 5.05,
        };

        return {
          getRate: (currency: string): number => rates[currency] ?? 1.0,
        };
      },
    },
  ],
  exports: ['EXCHANGE_RATE_PROVIDER', CurrencyService],
})
export class CurrencyModule {}
