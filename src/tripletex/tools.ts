import Anthropic from "@anthropic-ai/sdk";
import { TripletexClient } from "./client.js";
import * as api from "./api.js";

export type ToolName =
  | "search_customers"
  | "search_suppliers"
  | "search_invoices"
  | "get_invoice_details"
  | "get_ledger_accounts"
  | "get_ledger_postings"
  | "get_balance_sheet";

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: "search_customers",
    description:
      "Søk etter kunder i Tripletex. Returnerer liste med kundeinfo som navn, org.nr, e-post og telefon.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Søk på navn (delvis treff)" },
        organizationNumber: {
          type: "string",
          description: "Organisasjonsnummer",
        },
        email: { type: "string", description: "E-postadresse" },
        count: {
          type: "number",
          description: "Antall resultater (standard 10, maks 1000)",
        },
      },
    },
  },
  {
    name: "search_suppliers",
    description:
      "Søk etter leverandører i Tripletex. Returnerer liste med leverandørinfo.",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Søk på leverandørnavn (delvis treff)",
        },
        organizationNumber: {
          type: "string",
          description: "Organisasjonsnummer",
        },
        email: { type: "string", description: "E-postadresse" },
        count: { type: "number", description: "Antall resultater" },
      },
    },
  },
  {
    name: "search_invoices",
    description:
      "Søk etter fakturaer i Tripletex. Kan filtrere på dato, kunde og status. Returnerer fakturanummer, dato, beløp og betalingsstatus.",
    input_schema: {
      type: "object",
      properties: {
        invoiceDateFrom: {
          type: "string",
          description: "Fra-dato for fakturadato (format: YYYY-MM-DD)",
        },
        invoiceDateTo: {
          type: "string",
          description: "Til-dato for fakturadato (format: YYYY-MM-DD)",
        },
        invoiceDueDateFrom: {
          type: "string",
          description: "Fra-dato for forfallsdato (format: YYYY-MM-DD)",
        },
        invoiceDueDateTo: {
          type: "string",
          description: "Til-dato for forfallsdato (format: YYYY-MM-DD)",
        },
        customerId: { type: "number", description: "Kunde-ID i Tripletex" },
        count: { type: "number", description: "Antall resultater" },
      },
    },
  },
  {
    name: "get_invoice_details",
    description:
      "Hent detaljer for en spesifikk faktura basert på faktura-ID.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Faktura-ID i Tripletex" },
      },
      required: ["id"],
    },
  },
  {
    name: "get_ledger_accounts",
    description:
      "Hent kontoplan fra Tripletex. Returnerer kontonummer, navn og type.",
    input_schema: {
      type: "object",
      properties: {
        number: {
          type: "string",
          description:
            "Filtrer på kontonummer eller rekkevidde (f.eks. '1000-1999')",
        },
        count: { type: "number", description: "Antall kontoer" },
      },
    },
  },
  {
    name: "get_ledger_postings",
    description:
      "Hent regnskapsposteringer (bilag) for en periode. Nyttig for å se transaksjoner på spesifikke kontoer.",
    input_schema: {
      type: "object",
      properties: {
        dateFrom: {
          type: "string",
          description: "Fra-dato (format: YYYY-MM-DD) – PÅKREVD",
        },
        dateTo: {
          type: "string",
          description: "Til-dato (format: YYYY-MM-DD) – PÅKREVD",
        },
        accountNumber: {
          type: "number",
          description: "Filtrer på kontonummer",
        },
        customerId: { type: "number", description: "Filtrer på kunde-ID" },
        count: { type: "number", description: "Antall posteringer" },
      },
      required: ["dateFrom", "dateTo"],
    },
  },
  {
    name: "get_balance_sheet",
    description:
      "Hent balanseoppstilling for en periode. Viser eiendeler, gjeld og egenkapital per konto.",
    input_schema: {
      type: "object",
      properties: {
        dateFrom: {
          type: "string",
          description: "Fra-dato (format: YYYY-MM-DD) – PÅKREVD",
        },
        dateTo: {
          type: "string",
          description: "Til-dato (format: YYYY-MM-DD) – PÅKREVD",
        },
        count: { type: "number", description: "Antall linjer" },
      },
      required: ["dateFrom", "dateTo"],
    },
  },
];

type ToolInput = Record<string, string | number | boolean | undefined>;

export async function executeTool(
  client: TripletexClient,
  name: ToolName,
  input: ToolInput,
): Promise<string> {
  try {
    switch (name) {
      case "search_customers": {
        const result = await api.searchCustomers(client, {
          name: input.name as string,
          organizationNumber: input.organizationNumber as string,
          email: input.email as string,
          count: (input.count as number) ?? 10,
        });
        if (!result.values.length) return "Ingen kunder funnet.";
        return JSON.stringify(
          {
            totalt: result.fullResultSize,
            viser: result.values.length,
            kunder: result.values.map((c) => ({
              id: c.id,
              navn: c.name,
              orgNr: c.organizationNumber,
              epost: c.email,
              telefon: c.phoneNumber,
            })),
          },
          null,
          2,
        );
      }

      case "search_suppliers": {
        const result = await api.searchSuppliers(client, {
          name: input.name as string,
          organizationNumber: input.organizationNumber as string,
          email: input.email as string,
          count: (input.count as number) ?? 10,
        });
        if (!result.values.length) return "Ingen leverandører funnet.";
        return JSON.stringify(
          {
            totalt: result.fullResultSize,
            leverandorer: result.values.map((s) => ({
              id: s.id,
              navn: s.name,
              orgNr: s.organizationNumber,
              epost: s.email,
              telefon: s.phoneNumber,
            })),
          },
          null,
          2,
        );
      }

      case "search_invoices": {
        const result = await api.searchInvoices(client, {
          invoiceDateFrom: input.invoiceDateFrom as string,
          invoiceDateTo: input.invoiceDateTo as string,
          invoiceDueDateFrom: input.invoiceDueDateFrom as string,
          invoiceDueDateTo: input.invoiceDueDateTo as string,
          customerId: input.customerId as number,
          count: (input.count as number) ?? 20,
        });
        if (!result.values.length) return "Ingen fakturaer funnet.";
        return JSON.stringify(
          {
            totalt: result.fullResultSize,
            fakturaer: result.values.map((inv) => ({
              id: inv.id,
              fakturaNr: inv.invoiceNumber,
              dato: inv.invoiceDate,
              forfallDato: inv.invoiceDueDate,
              kunde: inv.customer?.name,
              belop: inv.amountCurrency,
              valuta: inv.currency?.code,
              betalt: inv.isCharged,
              kreditnota: inv.isCreditNote,
            })),
          },
          null,
          2,
        );
      }

      case "get_invoice_details": {
        const result = await api.getInvoice(client, input.id as number);
        const inv = result.value;
        return JSON.stringify(
          {
            id: inv.id,
            fakturaNr: inv.invoiceNumber,
            dato: inv.invoiceDate,
            forfallDato: inv.invoiceDueDate,
            kunde: inv.customer?.name,
            totalBelop: inv.amountCurrency,
            belopUtenMva: inv.amountExcludingVatCurrency,
            valuta: inv.currency?.code,
            betaltBelop: inv.paidAmount,
            betalt: inv.isCharged,
            kreditnota: inv.isCreditNote,
            kommentar: inv.comment,
          },
          null,
          2,
        );
      }

      case "get_ledger_accounts": {
        const result = await api.getLedgerAccounts(client, {
          number: input.number as string,
          count: (input.count as number) ?? 50,
        });
        if (!result.values.length) return "Ingen kontoer funnet.";
        return JSON.stringify(
          {
            totalt: result.fullResultSize,
            kontoer: result.values.map((a) => ({
              id: a.id,
              nummer: a.number,
              navn: a.name,
              type: a.ledgerType,
            })),
          },
          null,
          2,
        );
      }

      case "get_ledger_postings": {
        const result = await api.getLedgerPostings(client, {
          dateFrom: input.dateFrom as string,
          dateTo: input.dateTo as string,
          accountNumber: input.accountNumber as number,
          customerId: input.customerId as number,
          count: (input.count as number) ?? 50,
        });
        if (!result.values.length)
          return "Ingen posteringer funnet for angitt periode.";
        return JSON.stringify(
          {
            totalt: result.fullResultSize,
            posteringer: result.values.map((p) => ({
              id: p.id,
              dato: p.date,
              beskrivelse: p.description,
              konto: p.account
                ? `${p.account.number} ${p.account.name}`
                : undefined,
              kunde: p.customer?.name,
              leverandor: p.supplier?.name,
              belop: p.amountCurrency,
              valuta: p.currency?.code,
              bilagNr: p.voucher?.number,
            })),
          },
          null,
          2,
        );
      }

      case "get_balance_sheet": {
        const result = await api.getBalanceSheet(client, {
          dateFrom: input.dateFrom as string,
          dateTo: input.dateTo as string,
          count: (input.count as number) ?? 100,
        });
        if (!result.values.length) return "Ingen data i balanseoppstillingen.";
        return JSON.stringify(
          {
            totalt: result.fullResultSize,
            periode: `${input.dateFrom} – ${input.dateTo}`,
            linjer: result.values.map((b) => ({
              konto: `${b.account.number} ${b.account.name}`,
              belop: b.sumAmountCurrency,
              valuta: b.currency?.code,
            })),
          },
          null,
          2,
        );
      }

      default:
        return `Ukjent verktøy: ${name}`;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `Feil ved kall til Tripletex: ${msg}`;
  }
}
