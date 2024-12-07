import * as fs from "fs";
import * as path from "path";

//Read and parse data.json
const dataPath = path.join(__dirname, "data.json");
const rawData = fs.readFileSync(dataPath, "utf-8");
const jsonData = JSON.parse(rawData);
const data = jsonData.data;

// Calculate Revenue
const revenue = data.filter((entry: any) => entry.account_category === "revenue").reduce((sum: number, entry: any) => sum + entry.total_value, 0);

// Calculate Expenses
const expenses = data.filter((entry: any) => entry.account_category === "expense").reduce((sum: number, entry: any) => sum + entry.total_value, 0);

// Calculate Gross Profit Margin
const salesDebitTotal = data.filter((entry: any) => entry.account_type === "sales" && entry.value_type === "debit").reduce((sum: number, entry: any) => sum + entry.total_value, 0);
const grossProfitMargin = salesDebitTotal / revenue;

// Calculate Net Profit Margin
const netProfitMargin = (revenue - expenses) / revenue;

// Calculate Working Capital Ratio
// Calculate Assets
const assets = data
  .filter((entry: any) => entry.account_category === "assets" && ["current", "bank", "current_accounts_receivable"].includes(entry.account_type))
  .reduce((sum: number, entry: any) => {
    if (entry.value_type === "debit") {
      return sum + entry.total_value; // Add for debit
    } else if (entry.value_type === "credit") {
      return sum - entry.total_value; // Subtract for credit
    }
    return sum;
  }, 0);

// Calculate Liabilities
const liabilities = data
  .filter((entry: any) => entry.account_category === "liability" && ["current", "current_accounts_payable"].includes(entry.account_type))
  .reduce((sum: number, entry: any) => {
    if (entry.value_type === "credit") {
      return sum + entry.total_value; // Add for credit
    } else if (entry.value_type === "debit") {
      return sum - entry.total_value; // Subtract for debit
    }
    return sum;
  }, 0);

// Calculate Working Capital Ratio
const workingCapitalRatio = assets / liabilities;

//Formatting
const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

//Output
console.log(`Revenue: ${formatCurrency(revenue)}`);
console.log(`Expenses: ${formatCurrency(expenses)}`);
console.log(`Gross Profit Margin: ${formatPercentage(grossProfitMargin)}`);
console.log(`Net Profit Margin: ${formatPercentage(netProfitMargin)}`);
console.log(`Working Capital Ratio: ${formatPercentage(workingCapitalRatio)}`);
