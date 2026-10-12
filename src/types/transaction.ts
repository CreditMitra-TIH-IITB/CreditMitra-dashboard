export type RiskFlag = 'gambling' | 'bnpl_lending' | 'crypto' | null;
export type LifestyleDim =
  | 'essential'
  | 'aspirational'
  | 'commitment'
  | 'leverage'
  | 'risk'
  | 'neutral';
export type RecurringType = 'adhoc' | 'subscription' | 'emi_like' | 'payout_source';
export type Direction = 'credit' | 'debit';
export type ScoreBlock = 'cashflow' | 'lifestyle';

export interface Transaction {
  date: string;
  particulars: string;
  deposits: string;
  withdrawals: string;
  balance: string;
  payee: string | null;
  payee_type: 'person' | 'merchant' | string | null;
  payee_confidence: number | null;

  // Parsed numerics (Issue #5)
  txn_date?: string | null;
  amount?: number | null;
  direction?: Direction | null;
  balance_val?: number | null;

  // Merchant enrichment (Issue #7)
  category?: string | null;
  is_essential?: boolean | null;
  risk_flag?: RiskFlag | null;
  lifestyle_dim?: LifestyleDim | null;
  recurring_type?: RecurringType | null;
}

export interface MerchantEnrichment {
  canonical_name: string;
  category: string;
  is_essential: boolean;
  risk_flag: RiskFlag;
  lifestyle_dim: LifestyleDim;
  recurring_type: RecurringType;
}

export interface FeatureVector {
  salary_detected: boolean;
  gig_income_detected?: boolean; // recurring gig-platform payouts (engine: Gig Hustler)
  monthly_income: number;
  foir: number;
  net_cashflow: number;
  balance_buffer_days: number;

  essential_ratio: number;
  discretionary_ratio: number;
  cash_withdrawal_ratio: number;
  merchant_resolution_rate: number;

  bounce_count: number;
  bnpl_merchant_count: number;
  bnpl_share: number;
  gambling_share: number;

  months_covered: number;
  txn_count: number;
}

export interface LifestyleProfile {
  l1_essential_stability: number;
  l2_aspirational: number;
  l3_digital_maturity: number;
  l4_commitment: number;
  l5_leverage: number;
  l6_risk_appetite: number;

  category_diversity: number;
  merchant_loyalty: number;
  burstiness: number;
  category_turnover: number;

  archetype: string;
}

export interface ScoreFactor {
  factor: string;
  impact: number;
  block: ScoreBlock;
}

export interface CreditRiskReport {
  score: number;
  band: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent' | string;
  archetype: string;
  factors: ScoreFactor[];
  lifestyle: LifestyleProfile;
  features: FeatureVector;
  narrative: string;
}

export interface ProcessResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactions: Transaction[] | null;
  report: CreditRiskReport | null;
  error?: string | null;
}

export interface ReportResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  report: CreditRiskReport | null;
  error?: string | null;
}
