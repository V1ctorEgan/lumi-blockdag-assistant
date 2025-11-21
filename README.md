# 🌙 Lumi — Your Conversational Web3 Companion (Powered by BlockDAG)

> **Lumi** is an **AI-powered Web3 assistant** built on **BlockDAG**, designed to make decentralized finance fast, intuitive, and conversational.  
> Instead of navigating multiple wallet apps or explorers, users can simply talk to Lumi — a personal AI that understands and executes crypto commands in real time.

---

## 🚀 Overview

### 💡 The Problem

Managing crypto assets still feels like programming.  
Users must jump between explorers, wallets, and DeFi dashboards just to check balances, gas fees, or send tokens.  
This complexity keeps new users away and slows down decentralized adoption.

### 🌈 The Solution

**Lumi** turns blockchain interaction into a simple conversation.  
Just chat naturally:

> 🗣️ “What’s my BDAG balance?”  
> 🗣️ “How much gas did I spend this week?”  
> 🗣️ “Send 0.05 BDAG to @alex.”  
> 🗣️ “Alert me when my portfolio drops by 5%.”

Powered by **BlockDAG’s scalable, high-speed architecture**, Lumi delivers **instant wallet insights** and **smart AI suggestions** — without latency or congestion.

---

### 🌍 Market Opportunity

Over 100 million global crypto users and rising.

DeFi Total Value Locked (TVL) exceeds $100 billion, yet less than 10% of users actively engage due to complexity.

AI assistants (like ChatGPT) are now mainstream — integrating this behavior into Web3 creates a massive adoption bridge.

Lumi positions itself at the intersection of AI + DeFi + UX, targeting:

New crypto users seeking simplicity

Power DeFi traders who need fast, real-time data

Developers looking for conversational interfaces in their dApps

By leveraging BlockDAG’s speed, scalability, and developer-friendly APIs, Lumi can deliver instant, low-latency DeFi intelligence — making it the go-to Web3 conversational companion.

## 🧠 How Lumi Works

Lumi combines **AI-driven intent recognition** with **on-chain interaction**.  
It translates user messages into blockchain queries and commands, returning human-readable responses.

### ⚙️ High-Level Flow

User Message → AI Intent Engine → Action Handler → BlockDAG Network → Human Response

### 🔐 Core Components

| Layer                    | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| **Frontend (UI)**        | Chat interface built with React + WalletConnect.                                            |
| **Backend (Express.js)** | AI intent processing, API routing, and secure wallet logic.                                 |
| **AI Engine**            | OpenAI API (free trial) or LocalAI/HuggingFace fallback for natural language understanding. |
| **Blockchain Layer**     | BlockDAG network for wallet data, transactions, and smart contracts.                        |
| **Database**             | MongoDB for user profiles, preferences, and alerts.                                         |

---

## 🧱 Project Architecture

```plaintext
                 ┌────────────────────────┐
                 │     Frontend (UI)      │
                 │  • Chat Interface      │
                 │  • Wallet Connect SDK  │
                 └────────────┬───────────┘
                              │
                              ▼
┌─────────────────────────────┴─────────────────────────────┐
│                  Backend (Express.js API)                 │
│  • Receives user messages                                 │
│  • Sends to AI Intent Engine (OpenAI / Local Model)       │
│  • Maps intent → blockchain actions                       │
│  • Calls BlockDAG RPC /                    │
│  • Returns formatted response to UI                       │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │     BlockDAG Network        │
               │  • Wallet data & balances   │
               │  • Transactions & alerts    │
               │  • Smart contracts (DeFi)   │
               └─────────────────────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │   Smart-Contract Layer       │
               │  • Portfolio alerts          │
               │  • Auto-actions (optional)   │
               └─────────────────────────────┘
```

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Frontend   | React / TailwindCSS                                |
| Backend    | Express.js + Node.js                               |
| AI Engine  | OpenAI API (GPT-4o-mini) or LocalAI                |
| Blockchain | BlockDAG Network                                   |
| Database   | MongoDB                                            |
| Tools      | WalletConnect · Ethers.js · Framer Motion (for UI) |

---

## 🛠️ Local Setup & Installation 🧑‍💻

Follow these steps to get a local copy of **Lumi** running. This project requires configuring both the backend API and the React frontend.

### Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**
- **MongoDB** instance (local or remote cluster URI)
- **OpenAI API Key** (or setup for LocalAI/HuggingFace fallback)
- **Foundry**

---

### ⚙️ Step 1: Backend Setup (Express.js)

The backend handles the core AI intent logic, API routing, and the connection to the BlockDAG network.

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure environment variables:**
    Create a file named **`.env`** inside the `backend` folder and populate it with your configuration:

    ```
    # Backend Configuration
    PORT=3000
    MONGODB_URI="your_mongodb_connection_string"

    # AI Engine Configuration
    OPENAI_API_KEY="your_openai_key"

    # BlockDAG Connection
    BLOCKDAG_RPC_URL="[Official BlockDAG RPC Endpoint]"
    ```

4.  **Start the Backend Server:**
    ```bash
    npm start
    # or for development with hot reload:
    # npm run dev
    ```

---

### 🎨 Step 2: Frontend Setup (React/UI)

The frontend provides the conversational chat interface and handles WalletConnect integration.

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    ```

3.  **Start the Frontend Client:**
    ```bash
    npm start
    ```
    The application should now be accessible in your browser (typically at `http://localhost:3001` or similar).

---

## 🔭 Future Plans & Roadmap (Lumi V2) 🔮

Lumi has massive potential to evolve into a full-fledged financial control center for Web3.

- **Portfolio Tracking & DeFi Integration:**
  - Integrate **DEX/DEX Aggregator APIs** (on BlockDAG) to enable conversational swaps (e.g., "Swap 10 BDAG for stablecoin").
  - Advanced portfolio analysis (e.g., "Show my yield farm returns over the last month").
- **Security & Alerts:**
  - **On-chain Alerts:** Fully implement the smart-contract layer in the `smart-contracts` folder for persistent, event-driven alerts (e.g., "Alert me when my portfolio drops by 5%").
  - **Transaction Simulation:** Add pre-send simulation to warn users about potential scam approvals or high slippage before signing a transaction.
- **Community & Adoption:**
  - Develop a **Chrome Extension** for ambient access.
  - Support for multiple BlockDAG-compatible wallets and dApps.
