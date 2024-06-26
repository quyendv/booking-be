export enum VNPayBankCode {
  VNPAYQR = 'VNPAYQR',
  VNBANK = 'VNBANK',
  INTCARD = 'INTCARD',
}

export enum PaymentChannel {
  // COD = 'COD',
  // BANK = 'BANK',
  // MOMO = 'MOMO',
  // ZALO = 'ZALO',
  // PAYPAL = 'PAYPAL',
  // VISA = 'VISA',
  // MASTER = 'MASTER',
  VN_PAY = 'vn_pay',
}

export enum PaymentCurrency {
  VND = 'VND',
  // USD = 'USD',
  // EUR = 'EUR',
  // JPY = 'JPY',
  // KRW = 'KRW',
  // CNY = 'CNY',
  // GBP = 'GBP',
  // AUD = 'AUD',
  // CAD = 'CAD',
  // HKD = 'HKD',
  // SGD = 'SGD',
  // THB = 'THB',
  // MYR = 'MYR',
  // IDR = 'IDR',
  // PHP = 'PHP',
  // LAK = 'LAK',
  // MMK = 'MMK',
  // INR = 'INR',
  // BDT = 'BDT',
  // NPR = 'NPR',
  // PKR = 'PKR',
  // LKR = 'LKR',
  // MVR = 'MVR',
}

export enum BookingStatus {
  // CANCELLED = 'cancelled',
  // REFUNDED = 'refunded',

  // PENDING = 'pending', // waiting payment
  BOOKED = 'booked', // paid
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  // COMPLETED = 'completed', // checked_out is completed
  REVIEWED = 'reviewed',
}
