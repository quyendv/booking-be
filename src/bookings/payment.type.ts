type VnpayResultInfo = {
  vnp_Amount: string;
  vnp_TxnRef: string;
  vnp_PayDate: string;
  vnp_TmnCode: string;
  vnp_BankCode: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_BankTranNo: string;
  vnp_ResponseCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
};

export type PaymentInfo = VnpayResultInfo;
