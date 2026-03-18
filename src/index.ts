import * as readline from "readline";
import * as dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { TripletexClient } from "./tripletex/client.js";
import { TripletexAgent } from "./agent.js";

dotenv.config();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    console.error(`❌ Mangler miljøvariabel: ${name}`);
    console.error(`   Kopier .env.example til .env og fyll ut verdiene.`);
    process.exit(1);
  }
  return val;
}

async function main() {
  const anthropicKey = requireEnv("ANTHROPIC_API_KEY");
  const consumerToken = requireEnv("TRIPLETEX_CONSUMER_TOKEN");
  const employeeToken = requireEnv("TRIPLETEX_EMPLOYEE_TOKEN");
  const env = (process.env.TRIPLETEX_ENV as "test" | "production") ?? "test";

  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const tripletex = new TripletexClient({ consumerToken, employeeToken, env });
  const agent = new TripletexAgent(anthropic, tripletex);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  console.log("╔══════════════════════════════════════════╗");
  console.log("║       Tripletex AI-Agent                 ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log(`║  Miljø: ${env.padEnd(33)}║`);
  console.log("╚══════════════════════════════════════════╝");
  console.log("");
  console.log("Skriv spørsmålet ditt og trykk Enter.");
  console.log('Skriv "tøm" for å nullstille samtalehistorikk.');
  console.log('Skriv "avslutt" eller Ctrl+C for å avslutte.');
  console.log("");

  const prompt = () => {
    rl.question("Du: ", async (input) => {
      const text = input.trim();

      if (!text) {
        prompt();
        return;
      }

      if (text.toLowerCase() === "avslutt") {
        console.log("Ha det bra!");
        rl.close();
        return;
      }

      if (text.toLowerCase() === "tøm") {
        agent.clearHistory();
        console.log("✅ Samtalehistorikk tømt.\n");
        prompt();
        return;
      }

      console.log("\nAssistent: ");
      try {
        await agent.chat(text);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`\n❌ Feil: ${msg}\n`);
      }
      console.log("");

      prompt();
    });
  };

  prompt();
}

main().catch((err) => {
  console.error("Fatal feil:", err);
  process.exit(1);
});
