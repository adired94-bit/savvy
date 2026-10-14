// Prints which variables from .env.example are filled in .env.local. Names only, never values.
import fs from "node:fs";

const parse = (file) =>
  Object.fromEntries(
    fs.existsSync(file)
      ? fs.readFileSync(file, "utf8").split("\n").filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
      : [],
  );

const example = parse(".env.example");
const local = parse(".env.local");
const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "ANTHROPIC_API_KEY"];

if (!fs.existsSync(".env.local")) console.log(".env.local is missing. Run: cp .env.example .env.local");
let missing = 0;
for (const name of Object.keys(example)) {
  const ok = Boolean(local[name] || process.env[name]);
  const need = required.includes(name);
  if (!ok && need) missing++;
  console.log(`${ok ? "set    " : need ? "MISSING" : "empty  "} ${name}${need ? "" : " (optional)"}`);
}
if (local.NEXT_PUBLIC_SUPABASE_URL && !/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(local.NEXT_PUBLIC_SUPABASE_URL)) console.log("warning: NEXT_PUBLIC_SUPABASE_URL does not look like https://<project>.supabase.co");
console.log(missing ? `\n${missing} required value(s) still empty.` : "\nAll required values are set.");
process.exit(0);
