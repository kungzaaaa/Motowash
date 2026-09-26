export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum PaymentType {
  DEPOSIT = 'DEPOSIT',
  FULL = 'FULL',
  REMAINING = 'REMAINING'
}

export enum PaymentMethod {
  PROMPT_PAY = 'PROMPT_PAY',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH'
}
