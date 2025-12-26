export interface InvoiceItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  address: string;
  phone: string;
}

export interface InvoiceDetails {
  number: string;
  date: string;
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface CompanyDetails {
  address: string;
  phone: string;
  email: string;
}

export interface LayoutPosition {
  x: number;
  y: number;
}

export interface InvoiceLayout {
  logo: LayoutPosition;
  meta: LayoutPosition;
  customer: LayoutPosition;
  table: LayoutPosition;
  total: LayoutPosition;
  terms: LayoutPosition;
  payment: LayoutPosition;
  company: LayoutPosition;
}

export interface InvoiceState {
  invoice: InvoiceDetails;
  customer: CustomerDetails;
  items: InvoiceItem[];
  payment: PaymentDetails;
  company: CompanyDetails;
  logoSrc?: string;
  enableCustomLayout: boolean;
  layout: InvoiceLayout;
}