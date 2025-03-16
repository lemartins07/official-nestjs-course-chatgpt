import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  private exchangeRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    BRL: 5.05,
  };

  getExchangeRate(currency: string): number {
    return this.exchangeRates[currency] || 1.0;
  }

  convert(amount: number, currency: string): number {
    const rate = this.getExchangeRate(currency);
    return amount * rate;
  }
}
