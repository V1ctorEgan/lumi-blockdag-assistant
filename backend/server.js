// server.js - Lumi Backend API
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lumi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Models
const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  preferences: {
    alertThreshold: { type: Number, default: 5 },
    notifications: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const AlertSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, lowercase: true },
  type: {
    type: String,
    enum: ["price_drop", "price_rise", "balance_change"],
    required: true,
  },
  threshold: { type: Number, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const TransactionCacheSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, lowercase: true },
  hash: { type: String, required: true },
  from: String,
  to: String,
  value: String,
  gasUsed: String,
  timestamp: { type: Date, required: true },
  status: String,
});

const User = mongoose.model("User", UserSchema);
const Alert = mongoose.model("Alert", AlertSchema);
const TransactionCache = mongoose.model(
  "TransactionCache",
  TransactionCacheSchema
);

// Intent Recognition Engine (Rule-Based)
class IntentEngine {
  static analyze(message) {
    const msg = message.toLowerCase().trim();

    // Balance Check
    if (msg.match(/\b(balance|how much|wallet)\b/i)) {
      return { intent: "balance_check", confidence: 0.95 };
    }

    // Gas Analysis
    if (msg.match(/\b(gas|fee|fees|spent|cost)\b/i)) {
      const timeMatch = msg.match(/\b(today|week|month|yesterday)\b/i);
      return {
        intent: "gas_analysis",
        confidence: 0.92,
        params: { period: timeMatch ? timeMatch[0] : "week" },
      };
    }

    // Send Transaction
    if (msg.match(/\b(send|transfer|pay)\b/i)) {
      const amountMatch = msg.match(/(\d+\.?\d*)\s*(bdag|eth)?/i);
      const addressMatch = msg.match(/(0x[a-fA-F0-9]{40})|(@\w+)/);

      return {
        intent: "send_token",
        confidence: 0.9,
        params: {
          amount: amountMatch ? amountMatch[1] : null,
          recipient: addressMatch ? addressMatch[0] : null,
        },
      };
    }

    // Create Alert
    if (msg.match(/\b(alert|notify|notification|watch)\b/i)) {
      const thresholdMatch = msg.match(/(\d+)%/);
      const typeMatch = msg.match(
        /\b(drop|drops|fall|falls|rise|rises|increase)\b/i
      );

      return {
        intent: "create_alert",
        confidence: 0.88,
        params: {
          threshold: thresholdMatch ? parseInt(thresholdMatch[1]) : 5,
          type:
            typeMatch && typeMatch[0].match(/rise|increase/i)
              ? "price_rise"
              : "price_drop",
        },
      };
    }

    // Transaction History
    if (msg.match(/\b(history|transactions|recent|latest)\b/i)) {
      return { intent: "transaction_history", confidence: 0.93 };
    }

    // Portfolio Overview
    if (msg.match(/\b(portfolio|overview|summary|assets)\b/i)) {
      return { intent: "portfolio_overview", confidence: 0.91 };
    }

    // Help
    if (msg.match(/\b(help|what can you|commands|guide)\b/i)) {
      return { intent: "help", confidence: 0.99 };
    }

    // Default: unknown intent
    return { intent: "unknown", confidence: 0.0 };
  }
}

// BlockDAG Mock Integration (Replace with actual RPC calls)
class BlockDAGService {
  static async getBalance(address) {
    // Mock response - replace with actual BlockDAG RPC call
    // Example: await fetch(BLOCKDAG_RPC_URL, { method: 'POST', body: ... })
    return {
      balance: "15.42",
      token: "BDAG",
      usdValue: "308.40",
    };
  }

  static async getTransactions(address, limit = 10) {
    // Mock response - replace with actual BlockDAG explorer API
    const mockTxs = [
      {
        hash: "0xabc123...",
        from: address,
        to: "0xdef456...",
        value: "0.5",
        gasUsed: "0.001",
        timestamp: new Date(Date.now() - 86400000),
        status: "success",
      },
    ];
    return mockTxs;
  }

  static async calculateGasSpent(address, period) {
    // Mock response - replace with actual calculation from blockchain data
    const gasAmounts = {
      today: "0.002",
      week: "0.015",
      month: "0.068",
    };
    return gasAmounts[period] || gasAmounts.week;
  }

  static async sendTransaction(from, to, amount) {
    // Mock response - replace with actual transaction signing & broadcast
    return {
      success: true,
      hash: "0x" + Math.random().toString(16).substr(2, 64),
      message: "Transaction submitted successfully",
    };
  }
}

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Lumi Backend is running" });
});

// Main Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, walletAddress } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Analyze intent
    const analysis = IntentEngine.analyze(message);

    // Handle based on intent
    let response;

    switch (analysis.intent) {
      case "balance_check":
        if (!walletAddress) {
          response = {
            text: "Please connect your wallet first to check your balance.",
          };
        } else {
          const balance = await BlockDAGService.getBalance(walletAddress);
          response = {
            text: `Your current balance is **${balance.balance} ${balance.token}** (≈ $${balance.usdValue} USD)`,
            data: balance,
          };
        }
        break;

      case "gas_analysis":
        if (!walletAddress) {
          response = {
            text: "Please connect your wallet to analyze gas fees.",
          };
        } else {
          const period = analysis.params?.period || "week";
          const gasSpent = await BlockDAGService.calculateGasSpent(
            walletAddress,
            period
          );
          response = {
            text: `You've spent **${gasSpent} BDAG** on gas fees this ${period}.`,
            data: { gasSpent, period },
          };
        }
        break;

      case "send_token":
        if (!walletAddress) {
          response = { text: "Please connect your wallet to send tokens." };
        } else if (!analysis.params?.amount || !analysis.params?.recipient) {
          response = {
            text: 'Please specify both amount and recipient address. Example: "Send 0.05 BDAG to 0x123..."',
          };
        } else {
          response = {
            text: `Ready to send **${analysis.params.amount} BDAG** to \`${analysis.params.recipient}\`. Please confirm this transaction in your wallet.`,
            action: "confirm_transaction",
            data: analysis.params,
          };
        }
        break;

      case "create_alert":
        if (!walletAddress) {
          response = { text: "Please connect your wallet to create alerts." };
        } else {
          const alert = new Alert({
            walletAddress,
            type: analysis.params?.type || "price_drop",
            threshold: analysis.params?.threshold || 5,
          });
          await alert.save();
          response = {
            text: `Alert created! I'll notify you when your portfolio ${
              analysis.params?.type === "price_rise" ? "rises" : "drops"
            } by ${analysis.params?.threshold}%.`,
            data: alert,
          };
        }
        break;

      case "transaction_history":
        if (!walletAddress) {
          response = {
            text: "Please connect your wallet to view transaction history.",
          };
        } else {
          const txs = await BlockDAGService.getTransactions(walletAddress);
          response = {
            text: `Here are your recent transactions (${txs.length} found):`,
            data: txs,
          };
        }
        break;

      case "portfolio_overview":
        if (!walletAddress) {
          response = {
            text: "Please connect your wallet to view your portfolio.",
          };
        } else {
          const balance = await BlockDAGService.getBalance(walletAddress);
          response = {
            text: `**Portfolio Overview**\n\nTotal Value: $${balance.usdValue}\nBADAG Balance: ${balance.balance} BDAG`,
            data: balance,
          };
        }
        break;

      case "help":
        response = {
          text: `**I can help you with:**\n\n• "What's my balance?" - Check wallet balance\n• "How much gas this week?" - Analyze gas fees\n• "Send 0.05 BDAG to 0x123..." - Send tokens\n• "Alert me if portfolio drops 5%" - Create alerts\n• "Show transaction history" - View recent transactions\n• "Portfolio overview" - See your assets\n\nJust ask naturally! 🌙`,
        };
        break;

      default:
        response = {
          text: `I'm not sure I understood that. Try asking about your balance, gas fees, or say "help" to see what I can do.`,
        };
    }

    res.json({
      intent: analysis.intent,
      confidence: analysis.confidence,
      response,
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res
      .status(500)
      .json({ error: "Something went wrong processing your request" });
  }
});

// Get Wallet Balance
app.get("/api/wallet/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await BlockDAGService.getBalance(address);
    res.json(balance);
  } catch (error) {
    console.error("Balance Error:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// Get Transaction History
app.get("/api/wallet/transactions/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const txs = await BlockDAGService.getTransactions(address, limit);
    res.json(txs);
  } catch (error) {
    console.error("Transactions Error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Send Transaction
app.post("/api/wallet/send", async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    if (!from || !to || !amount) {
      return res
        .status(400)
        .json({ error: "Missing required fields: from, to, amount" });
    }

    const result = await BlockDAGService.sendTransaction(from, to, amount);
    res.json(result);
  } catch (error) {
    console.error("Send Error:", error);
    res.status(500).json({ error: "Failed to send transaction" });
  }
});

// Get User Alerts
app.get("/api/alerts/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const alerts = await Alert.find({
      walletAddress: address.toLowerCase(),
      active: true,
    });
    res.json(alerts);
  } catch (error) {
    console.error("Alerts Error:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// Create Alert
app.post("/api/alerts", async (req, res) => {
  try {
    const { walletAddress, type, threshold } = req.body;

    if (!walletAddress || !type || !threshold) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const alert = new Alert({
      walletAddress: walletAddress.toLowerCase(),
      type,
      threshold,
    });
    await alert.save();
    res.json(alert);
  } catch (error) {
    console.error("Create Alert Error:", error);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

// Delete Alert
app.delete("/api/alerts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Alert.findByIdAndUpdate(id, { active: false });
    res.json({ success: true, message: "Alert deleted" });
  } catch (error) {
    console.error("Delete Alert Error:", error);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌙 Lumi Backend running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});
