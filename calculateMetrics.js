"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
//Read and parse data.json
var dataPath = path.join(__dirname, "data.json");
var rawData = fs.readFileSync(dataPath, "utf-8");
var jsonData = JSON.parse(rawData);
var data = jsonData.data;
// Calculate Revenue
var revenue = data.filter(function (entry) { return entry.account_category === "revenue"; }).reduce(function (sum, entry) { return sum + entry.total_value; }, 0);
// Calculate Expenses
var expenses = data.filter(function (entry) { return entry.account_category === "expense"; }).reduce(function (sum, entry) { return sum + entry.total_value; }, 0);
// Calculate Gross Profit Margin
var salesDebitTotal = data.filter(function (entry) { return entry.account_type === "sales" && entry.value_type === "debit"; }).reduce(function (sum, entry) { return sum + entry.total_value; }, 0);
var grossProfitMargin = salesDebitTotal / revenue;
// Calculate Net Profit Margin
var netProfitMargin = (revenue - expenses) / revenue;
// Calculate Working Capital Ratio
// Calculate Assets
var assets = data
    .filter(function (entry) { return entry.account_category === "assets" && ["current", "bank", "current_accounts_receivable"].includes(entry.account_type); })
    .reduce(function (sum, entry) {
    if (entry.value_type === "debit") {
        return sum + entry.total_value; // Add for debit
    }
    else if (entry.value_type === "credit") {
        return sum - entry.total_value; // Subtract for credit
    }
    return sum;
}, 0);
// Calculate Liabilities
var liabilities = data
    .filter(function (entry) { return entry.account_category === "liability" && ["current", "current_accounts_payable"].includes(entry.account_type); })
    .reduce(function (sum, entry) {
    if (entry.value_type === "credit") {
        return sum + entry.total_value; // Add for credit
    }
    else if (entry.value_type === "debit") {
        return sum - entry.total_value; // Subtract for debit
    }
    return sum;
}, 0);
// Calculate Working Capital Ratio
var workingCapitalRatio = assets / liabilities;
//Formatting
var formatCurrency = function (value) {
    return "$".concat(value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
};
var formatPercentage = function (value) {
    return "".concat((value * 100).toFixed(1), "%");
};
//Output
console.log("Revenue: ".concat(formatCurrency(revenue)));
console.log("Expenses: ".concat(formatCurrency(expenses)));
console.log("Gross Profit Margin: ".concat(formatPercentage(grossProfitMargin)));
console.log("Net Profit Margin: ".concat(formatPercentage(netProfitMargin)));
console.log("Working Capital Ratio: ".concat(formatPercentage(workingCapitalRatio)));
