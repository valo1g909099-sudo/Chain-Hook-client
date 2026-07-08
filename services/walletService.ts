import { ENDPOINTS } from './config';
import { apiRequest } from './apiClient';

export interface WalletBalances {
  USD: string | number;
  EUR: string | number;
  JPY: string | number;
  GBP: string | number;
  preferred_currency?: string;
  is_active?: boolean;
  max_lmt?: number;
  use_lmt?: number;
}

export interface BackendTransaction {
  id: number;
  entity: string;
  date: string;
  method: string;
  status: string;
  amount: string;
  create_date_time: string;
}

export interface PriceHistoryItem {
  id: number;
  USD: string | number;
  EUR: string | number;
  JPY: string | number;
  GBP: string | number;
  create_date_time: string;
}

export interface ConversionResponse {
  detail: string;
  wallet: WalletBalances;
  converted_amount: number;
  rate: number;
}

export interface TransferResponse {
  detail: string;
  wallet: WalletBalances;
}

export interface PaymentResponse {
  detail: string;
  tx_id: string;
  wallet: WalletBalances;
}

export interface ChartPoint {
  name: string;
  amount?: number;
  value?: number;
}

export interface HoldingItem {
  asset: string;
  balance: number;
  value_usd: number;
}

export interface CurrencyDistributionItem {
  name: string;
  value: number;
}

export interface WalletAnalytics {
  total_volume: number;
  tx_count: number;
  net_balance: number;
  pending_count: number;
  daily_volumes: ChartPoint[];
  portfolio_growth: ChartPoint[];
  market_trend: ChartPoint[];
  currency_distribution: CurrencyDistributionItem[];
  holdings: HoldingItem[];
  max_lmt: number;
  use_lmt: number;
}

export const walletService = {
  async getBalances(): Promise<WalletBalances> {
    return apiRequest<WalletBalances>(ENDPOINTS.WALLET.BASE, { method: 'GET' });
  },

  async getTransactions(): Promise<BackendTransaction[]> {
    return apiRequest<BackendTransaction[]>(ENDPOINTS.WALLET.TRANSACTIONS, { method: 'GET' });
  },

  async convert(fromCurrency: string, toCurrency: string, amount: number): Promise<ConversionResponse> {
    return apiRequest<ConversionResponse>(ENDPOINTS.WALLET.CONVERT, {
      method: 'POST',
      data: { from_currency: fromCurrency, to_currency: toCurrency, amount },
    });
  },

  async transfer(
    recipient: string,
    currency: string,
    amount: number,
    type = 'Peer Transfer'
  ): Promise<TransferResponse> {
    return apiRequest<TransferResponse>(ENDPOINTS.WALLET.TRANSFER, {
      method: 'POST',
      data: { recipient, currency, amount, type },
    });
  },

  async payment(
    currency: string,
    amount: number,
    entity: string,
    method = 'Chain Hook Secure Pay'
  ): Promise<PaymentResponse> {
    return apiRequest<PaymentResponse>(ENDPOINTS.WALLET.PAYMENT, {
      method: 'POST',
      data: { currency, amount, entity, method },
    });
  },

  async getPriceHistory(): Promise<PriceHistoryItem[]> {
    return apiRequest<PriceHistoryItem[]>(ENDPOINTS.WALLET.PRICE_HISTORY, { method: 'GET' });
  },

  async getAnalytics(): Promise<WalletAnalytics> {
    return apiRequest<WalletAnalytics>(ENDPOINTS.WALLET.ANALYTICS, { method: 'GET' });
  },
};
