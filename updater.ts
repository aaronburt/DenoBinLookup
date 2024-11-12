import { parse } from "@std/csv/parse";
import { Database } from "jsr:@db/sqlite@0.11";

async function updateCSVFile(
  url: string =
    "https://raw.githubusercontent.com/venelinkochev/bin-list-data/refs/heads/master/bin-list-data.csv",
) {
  try {
    const response: Response = await fetch(url);

    if (response.ok) {
      const csv: string = await response.text();
      const data: Uint8Array = new TextEncoder().encode(csv);
      await Deno.writeFile("bin-list.csv", data);
    }
  } catch (error) {
    console.warn(error);
    return null;
  }
}

async function readCSVFile() {
  const data: string = await Deno.readTextFile("bin-list.csv");
  return parse(data, {
    columns: [
      "BIN",
      "Type",
      "Issuer",
      "IssuerUrl",
      "isoCode3",
      "Brand",
      "Category",
      "IssuerPhone",
      "isoCode2",
      "CountryName",
    ],
  });
}

async function writeCSVtoDb() {
  const db = new Database("bin-list.db");

  const csvPayload = await readCSVFile();

  db.prepare(`CREATE TABLE IF NOT EXISTS binlist (
        BIN TEXT PRIMARY KEY,
        Type TEXT,
        Issuer TEXT,
        IssuerUrl TEXT,
        isoCode3 TEXT,
        Brand TEXT,
        Category TEXT,
        IssuerPhone TEXT,
        isoCode2 TEXT,
        CountryName TEXT)`).run();

  const insertStmt = db.prepare(`
          INSERT OR REPLACE INTO binlist (
            BIN, Type, Issuer, IssuerUrl, isoCode3, Brand, Category, IssuerPhone, isoCode2, CountryName
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

  db.transaction(() => {
    for (const record of csvPayload) {
      insertStmt.run(
        record.BIN,
        record.Type,
        record.Issuer,
        record.IssuerUrl,
        record.isoCode3,
        record.Brand,
        record.Category,
        record.IssuerPhone,
        record.isoCode2,
        record.CountryName,
      );
    }
  })();

  db.close();
}

await updateCSVFile();
await writeCSVtoDb();
Deno.remove("bin-list.csv");