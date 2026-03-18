import Anthropic from "@anthropic-ai/sdk";
import { TripletexClient } from "./tripletex/client.js";
import { TOOL_DEFINITIONS, executeTool, ToolName } from "./tripletex/tools.js";

const SYSTEM_PROMPT = `Du er en hjelpsom regnskapsassistent som har tilgang til Tripletex regnskapssystem via API.

Du kan hjelpe brukeren med å:
- Søke etter kunder og leverandører
- Hente og analysere fakturaer
- Se regnskapsposteringer og kontoplan
- Hente balanseoppstilling

Svar alltid på norsk. Presenter tall med norsk tallformat (punktum som tusenskille, komma som desimaltegn)
og vis beløp med valuta. Vær konkret og strukturert i svarene dine.

Dagens dato er ${new Date().toISOString().split("T")[0]}.
Inneværende år er ${new Date().getFullYear()}.
Inneværende måned: ${new Date().toLocaleString("nb-NO", { month: "long", year: "numeric" })}.`;

export class TripletexAgent {
  private anthropic: Anthropic;
  private tripletex: TripletexClient;
  private messages: Anthropic.MessageParam[] = [];

  constructor(anthropic: Anthropic, tripletex: TripletexClient) {
    this.anthropic = anthropic;
    this.tripletex = tripletex;
  }

  async chat(userMessage: string): Promise<string> {
    this.messages.push({ role: "user", content: userMessage });

    let finalResponse = "";

    // Agentic loop – kjør til Claude er ferdig med verktøykall
    while (true) {
      const stream = this.anthropic.messages.stream({
        model: "claude-opus-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: TOOL_DEFINITIONS,
        messages: this.messages,
      });

      // Stream tekst til terminalen fortløpende
      stream.on("text", (delta) => {
        process.stdout.write(delta);
        finalResponse += delta;
      });

      const message = await stream.finalMessage();

      if (message.stop_reason === "end_turn") {
        process.stdout.write("\n");
        this.messages.push({
          role: "assistant",
          content: message.content,
        });
        break;
      }

      if (message.stop_reason === "tool_use") {
        if (finalResponse.length > 0) {
          process.stdout.write("\n");
          finalResponse = "";
        }

        // Legg til assistent-svar med verktøykall
        this.messages.push({
          role: "assistant",
          content: message.content,
        });

        // Kjør alle verktøy og samle resultater
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of message.content) {
          if (block.type === "tool_use") {
            console.log(`\n🔧 Henter data: ${this.toolLabel(block.name as ToolName)}...`);

            const result = await executeTool(
              this.tripletex,
              block.name as ToolName,
              block.input as Record<string, string | number | boolean | undefined>,
            );

            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: result,
            });
          }
        }

        // Send verktøyresultater tilbake
        this.messages.push({
          role: "user",
          content: toolResults,
        });

        continue;
      }

      // pause_turn eller annen stop_reason – append og re-send
      this.messages.push({ role: "assistant", content: message.content });
      break;
    }

    return finalResponse;
  }

  private toolLabel(name: ToolName): string {
    const labels: Record<ToolName, string> = {
      search_customers: "kunder",
      search_suppliers: "leverandører",
      search_invoices: "fakturaer",
      get_invoice_details: "fakturadetajer",
      get_ledger_accounts: "kontoplan",
      get_ledger_postings: "posteringer",
      get_balance_sheet: "balanseoppstilling",
    };
    return labels[name] ?? name;
  }

  clearHistory(): void {
    this.messages = [];
  }
}
