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

export interface InvoiceState {
  invoice: InvoiceDetails;
  customer: CustomerDetails;
  items: InvoiceItem[];
  payment: PaymentDetails;
  company: CompanyDetails;
  logoSrc?: string; // Stores the Base64 string of the uploaded logo
}