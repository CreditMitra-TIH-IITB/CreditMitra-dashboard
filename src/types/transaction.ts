export interface Transaction {
  date: string;
  particulars: string;
  deposits: string;
  withdrawals: string;
  balance: string;
  payee: string | null;
}

export interface ProcessResponse {
  transactions: Transaction[];
}
