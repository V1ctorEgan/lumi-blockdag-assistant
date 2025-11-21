// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LumiAlerts
 * @notice Smart contract for managing user alerts on BlockDAG network
 * @dev Stores alert conditions on-chain and emits events when triggered
 */
contract LumiAlerts {
    // Alert Types
    uint8 public constant ALERT_TYPE_BALANCE_BELOW = 1;
    uint8 public constant ALERT_TYPE_LARGE_TRANSACTION = 2;
    uint8 public constant ALERT_TYPE_GAS_LIMIT_WEEKLY = 3;

    // Struct to store alert information
    struct Alert {
        uint256 id;
        address user;
        uint8 alertType;
        uint256 threshold;
        bool active;
        uint256 createdAt;
    }

    // Struct to track gas spending
    struct GasTracker {
        uint256 weeklyGasSpent;
        uint256 weekStartTime;
    }

    // Storage
    mapping(address => Alert[]) private userAlerts;
    mapping(address => GasTracker) private userGasTracking;
    mapping(address => uint256) private alertIdCounter;

    // Events
    event AlertCreated(
        address indexed user,
        uint256 indexed alertId,
        uint8 alertType,
        uint256 threshold,
        uint256 timestamp
    );

    event AlertTriggered(
        address indexed user,
        uint256 indexed alertId,
        uint8 alertType,
        uint256 currentValue,
        uint256 threshold,
        uint256 timestamp
    );

    event AlertRemoved(
        address indexed user,
        uint256 indexed alertId,
        uint256 timestamp
    );

    event AlertUpdated(
        address indexed user,
        uint256 indexed alertId,
        uint256 newThreshold,
        uint256 timestamp
    );

    // Errors
    error InvalidAlertType();
    error InvalidThreshold();
    error AlertNotFound();
    error Unauthorized();

    /**
     * @notice Create a new alert
     * @param _alertType Type of alert (1=balance, 2=large tx, 3=gas)
     * @param _threshold Threshold value in wei
     */
    function createAlert(uint8 _alertType, uint256 _threshold) external {
        if (_alertType < 1 || _alertType > 3) revert InvalidAlertType();
        if (_threshold == 0) revert InvalidThreshold();

        uint256 alertId = alertIdCounter[msg.sender]++;

        Alert memory newAlert = Alert({
            id: alertId,
            user: msg.sender,
            alertType: _alertType,
            threshold: _threshold,
            active: true,
            createdAt: block.timestamp
        });

        userAlerts[msg.sender].push(newAlert);

        emit AlertCreated(
            msg.sender,
            alertId,
            _alertType,
            _threshold,
            block.timestamp
        );
    }

    /**
     * @notice Remove an alert
     * @param _alertId ID of the alert to remove
     */
    function removeAlert(uint256 _alertId) external {
        Alert[] storage alerts = userAlerts[msg.sender];
        bool found = false;

        for (uint256 i = 0; i < alerts.length; i++) {
            if (alerts[i].id == _alertId && alerts[i].active) {
                alerts[i].active = false;
                found = true;
                emit AlertRemoved(msg.sender, _alertId, block.timestamp);
                break;
            }
        }

        if (!found) revert AlertNotFound();
    }

    /**
     * @notice Update an existing alert's threshold
     * @param _alertId ID of the alert to update
     * @param _newThreshold New threshold value
     */
    function updateAlert(uint256 _alertId, uint256 _newThreshold) external {
        if (_newThreshold == 0) revert InvalidThreshold();

        Alert[] storage alerts = userAlerts[msg.sender];
        bool found = false;

        for (uint256 i = 0; i < alerts.length; i++) {
            if (alerts[i].id == _alertId && alerts[i].active) {
                alerts[i].threshold = _newThreshold;
                found = true;
                emit AlertUpdated(
                    msg.sender,
                    _alertId,
                    _newThreshold,
                    block.timestamp
                );
                break;
            }
        }

        if (!found) revert AlertNotFound();
    }

    /**
     * @notice Check alerts after a transaction
     * @param _user Address to check alerts for
     * @param _transactionAmount Amount being sent in the transaction
     * @param _gasUsed Gas used in the transaction
     */
    function checkAlerts(
        address _user,
        uint256 _transactionAmount,
        uint256 _gasUsed
    ) external {
        Alert[] storage alerts = userAlerts[_user];
        uint256 currentBalance = _user.balance;

        for (uint256 i = 0; i < alerts.length; i++) {
            if (!alerts[i].active) continue;

            // Check Balance Below Alert
            if (alerts[i].alertType == ALERT_TYPE_BALANCE_BELOW) {
                if (currentBalance < alerts[i].threshold) {
                    emit AlertTriggered(
                        _user,
                        alerts[i].id,
                        ALERT_TYPE_BALANCE_BELOW,
                        currentBalance,
                        alerts[i].threshold,
                        block.timestamp
                    );
                }
            }

            // Check Large Transaction Alert
            if (alerts[i].alertType == ALERT_TYPE_LARGE_TRANSACTION) {
                if (_transactionAmount > alerts[i].threshold) {
                    emit AlertTriggered(
                        _user,
                        alerts[i].id,
                        ALERT_TYPE_LARGE_TRANSACTION,
                        _transactionAmount,
                        alerts[i].threshold,
                        block.timestamp
                    );
                }
            }

            // Check Gas Limit Alert
            if (alerts[i].alertType == ALERT_TYPE_GAS_LIMIT_WEEKLY) {
                _updateGasTracking(_user, _gasUsed);
                GasTracker memory tracker = userGasTracking[_user];

                if (tracker.weeklyGasSpent > alerts[i].threshold) {
                    emit AlertTriggered(
                        _user,
                        alerts[i].id,
                        ALERT_TYPE_GAS_LIMIT_WEEKLY,
                        tracker.weeklyGasSpent,
                        alerts[i].threshold,
                        block.timestamp
                    );
                }
            }
        }
    }

    /**
     * @notice Update gas tracking for a user
     * @param _user User address
     * @param _gasUsed Gas used in current transaction
     */
    function _updateGasTracking(address _user, uint256 _gasUsed) private {
        GasTracker storage tracker = userGasTracking[_user];

        // Check if a week has passed (7 days = 604800 seconds)
        if (block.timestamp >= tracker.weekStartTime + 604800) {
            // Reset weekly counter
            tracker.weeklyGasSpent = _gasUsed;
            tracker.weekStartTime = block.timestamp;
        } else {
            // Add to current week
            tracker.weeklyGasSpent += _gasUsed;
        }
    }

    /**
     * @notice Get all alerts for a user
     * @param _user User address
     * @return Array of user's alerts
     */
    function getUserAlerts(
        address _user
    ) external view returns (Alert[] memory) {
        return userAlerts[_user];
    }

    /**
     * @notice Get active alerts for a user
     * @param _user User address
     * @return Array of active alerts
     */
    function getActiveAlerts(
        address _user
    ) external view returns (Alert[] memory) {
        Alert[] memory allAlerts = userAlerts[_user];
        uint256 activeCount = 0;

        // Count active alerts
        for (uint256 i = 0; i < allAlerts.length; i++) {
            if (allAlerts[i].active) {
                activeCount++;
            }
        }

        // Create array of active alerts
        Alert[] memory activeAlerts = new Alert[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < allAlerts.length; i++) {
            if (allAlerts[i].active) {
                activeAlerts[index] = allAlerts[i];
                index++;
            }
        }

        return activeAlerts;
    }

    /**
     * @notice Get gas tracking info for a user
     * @param _user User address
     * @return weeklyGasSpent Amount of gas spent this week
     * @return weekStartTime Timestamp when current week started
     */
    function getGasTracking(
        address _user
    ) external view returns (uint256 weeklyGasSpent, uint256 weekStartTime) {
        GasTracker memory tracker = userGasTracking[_user];
        return (tracker.weeklyGasSpent, tracker.weekStartTime);
    }

    /**
     * @notice Get a specific alert by ID
     * @param _user User address
     * @param _alertId Alert ID
     * @return Alert struct
     */
    function getAlert(
        address _user,
        uint256 _alertId
    ) external view returns (Alert memory) {
        Alert[] memory alerts = userAlerts[_user];

        for (uint256 i = 0; i < alerts.length; i++) {
            if (alerts[i].id == _alertId) {
                return alerts[i];
            }
        }

        revert AlertNotFound();
    }

    /**
     * @notice Get total number of alerts for a user
     * @param _user User address
     * @return Total alert count
     */
    function getAlertCount(address _user) external view returns (uint256) {
        return userAlerts[_user].length;
    }
}
