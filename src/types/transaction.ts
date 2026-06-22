export interface Transaction {
  date: string;
  particulars: string;
  deposits: string;
  withdrawals: string;
  balance: string;
  payee: string | null;
  payee_type: string | null;
  payee_confidence: number | null;
}

export interface ProcessResponse {
  transactions: Transaction[];
}
