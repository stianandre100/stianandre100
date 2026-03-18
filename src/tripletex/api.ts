import { TripletexClient } from "./client.js";

interface ListResponse<T> {
  fullResultSize: number;
  from: number;
  count: number;
  versionDigest: string;
  values: T[];
}

interface ObjectResponse<T> {
  value: T;
}

// ─── Customer ───────────────────────────────────────────────────────────────

export interface Customer {
  id: number;
  name: string;
  organizationNumber?: string;
  email?: string;
  phoneNumber?: string;
  address?: {
    addressLine1?: string;
    postalCode?: string;
    city?: string;
    country?: { id: number; displayName: string };
  };
  isSupplier?: boolean;
  isCustomer?: boolean;
  accountManagerEmployee?: { id: number; displayName: string };
}

export async function searchCustomers(
  client: TripletexClient,
  params: {
    name?: string;
    organizationNumber?: string;
    email?: string;
    from?: number;
    count?: number;
  },
): Promise<ListResponse<Customer>> {
  return client.get<ListResponse<Customer>>("/customer", {
    ...params,
    fields:
      "id,name,organizationNumber,email,phoneNumber,address,isCustomer,isSupplier",
  });
}

export async function getCustomer(
  client: TripletexClient,
  id: number,
): Promise<ObjectResponse<Customer>> {
  return client.get<ObjectResponse<Customer>>(`/customer/${id}`);
}

// ─── Supplier ────────────────────────────────────────────────────────────────

export interface Supplier {
  id: number;
  name: string;
  organizationNumber?: string;
  email?: string;
  phoneNumber?: string;
  isSupplier?: boolean;
  supplierNumber?: number;
}

export async function searchSuppliers(
  client: TripletexClient,
  params: {
    name?: string;
    organizationNumber?: string;
    email?: string;
    from?: number;
    count?: number;
  },
): Promise<ListResponse<Supplier>> {
  return client.get<ListResponse<Supplier>>("/supplier", {
    ...params,
    fields:
      "id,name,organizationNumber,email,phoneNumber,isSupplier,supplierNumber",
  });
}

// ─── Invoice ─────────────────────────────────────────────────────────────────

export interface Invoice {
  id: number;
  invoiceNumber?: number;
  invoiceDate?: string;
  customer?: { id: number; name: string };
  invoiceDueDate?: string;
  amount?: number;
  amountCurrency?: number;
  amountExcludingVat?: number;
  amountExcludingVatCurrency?: number;
  currency?: { id: string; code: string };
  isCreditNote?: boolean;
  ehfSendStatus?: string;
  comment?: string;
  paymentTypeId?: number;
  paidAmount?: number;
  isCharged?: boolean;
  orders?: Array<{ id: number; number: string }>;
}

export async function searchInvoices(
  client: TripletexClient,
  params: {
    invoiceDateFrom?: string;
    invoiceDateTo?: string;
    invoiceDueDateFrom?: string;
    invoiceDueDateTo?: string;
    customerId?: number;
    id?: string;
    from?: number;
    count?: number;
  },
): Promise<ListResponse<Invoice>> {
  return client.get<ListResponse<Invoice>>("/invoice", {
    ...params,
    fields:
      "id,invoiceNumber,invoiceDate,customer,invoiceDueDate,amount,amountCurrency,currency,isCreditNote,paidAmount,isCharged,comment",
  });
}

export async function getInvoice(
  client: TripletexClient,
  id: number,
): Promise<ObjectResponse<Invoice>> {
  return client.get<ObjectResponse<Invoice>>(`/invoice/${id}`);
}

// ─── Ledger / Accounts ───────────────────────────────────────────────────────

export interface LedgerAccount {
  id: number;
  number: number;
  name: string;
  description?: string;
  type?: { id: number; name: string };
  vatType?: { id: number; number: string; name: string };
  isCloseable?: boolean;
  isApplicableForSupplierInvoice?: boolean;
  ledgerType?: string;
}

export async function getLedgerAccounts(
  client: TripletexClient,
  params: {
    id?: string;
    number?: string;
    from?: number;
    count?: number;
  } = {},
): Promise<ListResponse<LedgerAccount>> {
  return client.get<ListResponse<LedgerAccount>>("/ledger/account", {
    ...params,
    fields: "id,number,name,description,type,vatType,ledgerType",
  });
}

// ─── Ledger Postings ─────────────────────────────────────────────────────────

export interface LedgerPosting {
  id: number;
  date: string;
  description?: string;
  account?: { id: number; number: number; name: string };
  customer?: { id: number; name: string };
  supplier?: { id: number; name: string };
  employee?: { id: number; displayName: string };
  project?: { id: number; name: string };
  amountCurrency?: number;
  currency?: { id: string; code: string };
  closeGroup?: { id: number };
  voucher?: { id: number; number: number };
}

export async function getLedgerPostings(
  client: TripletexClient,
  params: {
    dateFrom: string;
    dateTo: string;
    accountId?: number;
    accountNumber?: number;
    customerId?: number;
    from?: number;
    count?: number;
  },
): Promise<ListResponse<LedgerPosting>> {
  return client.get<ListResponse<LedgerPosting>>("/ledger", {
    ...params,
    fields:
      "id,date,description,account,customer,supplier,amountCurrency,currency,voucher",
  });
}

// ─── Balance Sheet ────────────────────────────────────────────────────────────

export interface BalanceSheetEntry {
  account: { id: number; number: number; name: string };
  sumAmountCurrency: number;
  currency: { id: string; code: string };
}

export async function getBalanceSheet(
  client: TripletexClient,
  params: {
    dateFrom: string;
    dateTo: string;
    from?: number;
    count?: number;
  },
): Promise<ListResponse<BalanceSheetEntry>> {
  return client.get<ListResponse<BalanceSheetEntry>>("/balanceSheet", {
    ...params,
    fields: "account,sumAmountCurrency,currency",
  });
}
