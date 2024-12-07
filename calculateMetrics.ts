import * as fs from "fs";
import * as path from "path";

//Read and parse data.json
const dataPath = path.join(__dirname, "data.json");
const rawData = fs.readFileSync(dataPath, "utf-8");
const jsonData = JSON.parse(rawData);
const data = jsonData.data;

//Calculate Revenue
const revenue = data.filter((entry: any) => entry.account_category === "revenue").reduce((sum: number, entry: any) => sum + entry.total_value, 0);

// Calculate Expenses
const expenses = data.filter((entry: any) => entry.account_category === "expense").reduce((sum: number, entry: any) => sum + entry.total_value, 0);

// Calculate Gross Profit Margin
const salesDebitTotal = data.filter((entry: any) => entry.account_type === "sales" && entry.value_type === "debit").reduce((sum: number, entry: any) => sum + entry.total_value, 0);
const grossProfitMargin = salesDebitTotal / revenue;

// Calculate Net Profit Margin
const netProfitMargin = (revenue - expenses) / revenue;

// Calculate Working Capital Ratio
const assets = data
  .filter((entry: any) => entry.account_category === "assets" && ["current", "bank", "current_accounts_receivable"].includes(entry.account_type))
  .reduce((sum: number, entry: any) => {
    return entry.value_type === "debit" ? sum + entry.total_value : sum - entry.total_value;
  }, 0);
