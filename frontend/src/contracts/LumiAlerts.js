export const LUMI_ALERTS_ADDRESS = "0xB1B12fD648e4D0374b4c8B46034aE1c83F9406AA";

export const BLOCKDAG_NETWORK = {
  chainId: 1043,
  chainName: "BlockDAG Awakening Testnet",
  rpcUrls: ["https://rpc.awakening.bdagscan.com"],
  blockExplorerUrls: ["https://awakening.bdagscan.com"],
  nativeCurrency: {
    name: "BDAG",
    symbol: "BDAG",
    decimals: 18
  }
};

export const LUMI_ALERTS_ABI = [
  {
    "type": "function",
    "name": "createAlert",
    "inputs": [
      {"name": "_alertType", "type": "uint8"},
      {"name": "_threshold", "type": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeAlert",
    "inputs": [{"name": "_alertId", "type": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateAlert",
    "inputs": [
      {"name": "_alertId", "type": "uint256"},
      {"name": "_newThreshold", "type": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getUserAlerts",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "user", "type": "address"},
          {"name": "alertType", "type": "uint8"},
          {"name": "threshold", "type": "uint256"},
          {"name": "active", "type": "bool"},
          {"name": "createdAt", "type": "uint256"}
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActiveAlerts",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "user", "type": "address"},
          {"name": "alertType", "type": "uint8"},
          {"name": "threshold", "type": "uint256"},
          {"name": "active", "type": "bool"},
          {"name": "createdAt", "type": "uint256"}
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAlert",
    "inputs": [
      {"name": "_user", "type": "address"},
      {"name": "_alertId", "type": "uint256"}
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "user", "type": "address"},
          {"name": "alertType", "type": "uint8"},
          {"name": "threshold", "type": "uint256"},
          {"name": "active", "type": "bool"},
          {"name": "createdAt", "type": "uint256"}
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAlertCount",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGasTracking",
    "inputs": [{"name": "_user", "type": "address"}],
    "outputs": [
      {"name": "weeklyGasSpent", "type": "uint256"},
      {"name": "weekStartTime", "type": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "AlertCreated",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "alertId", "type": "uint256", "indexed": true},
      {"name": "alertType", "type": "uint8", "indexed": false},
      {"name": "threshold", "type": "uint256", "indexed": false},
      {"name": "timestamp", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "AlertTriggered",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "alertId", "type": "uint256", "indexed": true},
      {"name": "alertType", "type": "uint8", "indexed": false},
      {"name": "currentValue", "type": "uint256", "indexed": false},
      {"name": "threshold", "type": "uint256", "indexed": false},
      {"name": "timestamp", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "AlertRemoved",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "alertId", "type": "uint256", "indexed": true},
      {"name": "timestamp", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "AlertUpdated",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true},
      {"name": "alertId", "type": "uint256", "indexed": true},
      {"name": "newThreshold", "type": "uint256", "indexed": false},
      {"name": "timestamp", "type": "uint256", "indexed": false}
    ]
  }
];

export const ALERT_TYPES = {
  BALANCE_BELOW: 1,
  LARGE_TRANSACTION: 2,
  GAS_LIMIT_WEEKLY: 3
};

export const ALERT_TYPE_NAMES = {
  1: "Balance Below",
  2: "Large Transaction",
  3: "Weekly Gas Limit"
};