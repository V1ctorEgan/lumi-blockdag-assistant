// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LumiAlerts.sol";

contract LumiAlertsTest is Test {
    LumiAlerts public lumiAlerts;
    address public user1;
    address public user2;

    function setUp() public {
        lumiAlerts = new LumiAlerts();
        user1 = address(0x1);
        user2 = address(0x2);

        // Give users some ETH
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
    }

    function testCreateBalanceAlert() public {
        vm.startPrank(user1);

        // Create a balance alert
        lumiAlerts.createAlert(1, 5 ether);

        // Get user alerts
        LumiAlerts.Alert[] memory alerts = lumiAlerts.getUserAlerts(user1);

        assertEq(alerts.length, 1);
        assertEq(alerts[0].alertType, 1);
        assertEq(alerts[0].threshold, 5 ether);
        assertTrue(alerts[0].active);

        vm.stopPrank();
    }

    function testCreateMultipleAlerts() public {
        vm.startPrank(user1);

        lumiAlerts.createAlert(1, 5 ether); // Balance alert
        lumiAlerts.createAlert(2, 10 ether); // Large tx alert
        lumiAlerts.createAlert(3, 1 ether); // Gas alert

        LumiAlerts.Alert[] memory alerts = lumiAlerts.getUserAlerts(user1);
        assertEq(alerts.length, 3);

        vm.stopPrank();
    }

    function testRemoveAlert() public {
        vm.startPrank(user1);

        // Create alert
        lumiAlerts.createAlert(1, 5 ether);

        // Remove alert
        lumiAlerts.removeAlert(0);

        // Check it's inactive
        LumiAlerts.Alert[] memory alerts = lumiAlerts.getUserAlerts(user1);
        assertFalse(alerts[0].active);

        vm.stopPrank();
    }

    function testUpdateAlert() public {
        vm.startPrank(user1);

        // Create alert
        lumiAlerts.createAlert(1, 5 ether);

        // Update threshold
        lumiAlerts.updateAlert(0, 10 ether);

        // Verify update
        LumiAlerts.Alert memory alert = lumiAlerts.getAlert(user1, 0);
        assertEq(alert.threshold, 10 ether);

        vm.stopPrank();
    }

    function testCheckBalanceAlert() public {
        vm.startPrank(user1);

        // Create balance alert for 50 ether
        lumiAlerts.createAlert(1, 50 ether);

        vm.stopPrank();

        // Simulate transaction that reduces balance below threshold
        vm.prank(user1);
        payable(user2).transfer(60 ether);

        // Check alerts (balance should now be 40 ether, below 50 threshold)
        vm.expectEmit(true, true, false, true);
        emit LumiAlerts.AlertTriggered(
            user1,
            0,
            1,
            40 ether,
            50 ether,
            block.timestamp
        );

        lumiAlerts.checkAlerts(user1, 60 ether, 21000);
    }

    function testCheckLargeTransactionAlert() public {
        vm.startPrank(user1);

        // Create large transaction alert for 10 ether
        lumiAlerts.createAlert(2, 10 ether);

        vm.stopPrank();

        // Check alert with transaction of 15 ether (above threshold)
        vm.expectEmit(true, true, false, true);
        emit LumiAlerts.AlertTriggered(
            user1,
            0,
            2,
            15 ether,
            10 ether,
            block.timestamp
        );

        lumiAlerts.checkAlerts(user1, 15 ether, 21000);
    }

    function testGasTracking() public {
        vm.startPrank(user1);

        // Create gas alert for 1 ether weekly
        lumiAlerts.createAlert(3, 1 ether);

        vm.stopPrank();

        // Simulate gas usage
        lumiAlerts.checkAlerts(user1, 1 ether, 0.5 ether);
        lumiAlerts.checkAlerts(user1, 1 ether, 0.6 ether);

        // Check gas tracking (should be 1.1 ether total, above 1 ether threshold)
        (uint256 weeklyGas, ) = lumiAlerts.getGasTracking(user1);
        assertEq(weeklyGas, 1.1 ether);
    }

    function testGetActiveAlerts() public {
        vm.startPrank(user1);

        // Create 3 alerts
        lumiAlerts.createAlert(1, 5 ether);
        lumiAlerts.createAlert(2, 10 ether);
        lumiAlerts.createAlert(3, 1 ether);

        // Remove one
        lumiAlerts.removeAlert(1);

        // Get active alerts (should be 2)
        LumiAlerts.Alert[] memory activeAlerts = lumiAlerts.getActiveAlerts(
            user1
        );
        assertEq(activeAlerts.length, 2);

        vm.stopPrank();
    }

    function testInvalidAlertType() public {
        vm.startPrank(user1);

        vm.expectRevert(LumiAlerts.InvalidAlertType.selector);
        lumiAlerts.createAlert(4, 5 ether); // Invalid type

        vm.stopPrank();
    }

    function testInvalidThreshold() public {
        vm.startPrank(user1);

        vm.expectRevert(LumiAlerts.InvalidThreshold.selector);
        lumiAlerts.createAlert(1, 0); // Zero threshold

        vm.stopPrank();
    }

    function testRemoveNonExistentAlert() public {
        vm.startPrank(user1);

        vm.expectRevert(LumiAlerts.AlertNotFound.selector);
        lumiAlerts.removeAlert(999); // Alert doesn't exist

        vm.stopPrank();
    }

    function testGetAlertCount() public {
        vm.startPrank(user1);

        assertEq(lumiAlerts.getAlertCount(user1), 0);

        lumiAlerts.createAlert(1, 5 ether);
        assertEq(lumiAlerts.getAlertCount(user1), 1);

        lumiAlerts.createAlert(2, 10 ether);
        assertEq(lumiAlerts.getAlertCount(user1), 2);

        vm.stopPrank();
    }

    function testWeeklyGasReset() public {
        vm.startPrank(user1);
        lumiAlerts.createAlert(3, 1 ether);
        vm.stopPrank();

        // Add gas in week 1
        lumiAlerts.checkAlerts(user1, 0, 0.5 ether);

        (uint256 weeklyGas1, uint256 weekStart1) = lumiAlerts.getGasTracking(
            user1
        );
        assertEq(weeklyGas1, 0.5 ether);

        // Fast forward 8 days
        vm.warp(block.timestamp + 8 days);

        // Add more gas (should reset)
        lumiAlerts.checkAlerts(user1, 0, 0.3 ether);

        (uint256 weeklyGas2, uint256 weekStart2) = lumiAlerts.getGasTracking(
            user1
        );
        assertEq(weeklyGas2, 0.3 ether); // Should be reset, not 0.8
        assertTrue(weekStart2 > weekStart1);
    }

    function testMultipleUsersIndependent() public {
        // User1 creates alerts
        vm.startPrank(user1);
        lumiAlerts.createAlert(1, 5 ether);
        lumiAlerts.createAlert(2, 10 ether);
        vm.stopPrank();

        // User2 creates different alerts
        vm.startPrank(user2);
        lumiAlerts.createAlert(1, 15 ether);
        vm.stopPrank();

        // Check they're independent
        assertEq(lumiAlerts.getAlertCount(user1), 2);
        assertEq(lumiAlerts.getAlertCount(user2), 1);

        LumiAlerts.Alert[] memory user1Alerts = lumiAlerts.getUserAlerts(user1);
        LumiAlerts.Alert[] memory user2Alerts = lumiAlerts.getUserAlerts(user2);

        assertEq(user1Alerts[0].threshold, 5 ether);
        assertEq(user2Alerts[0].threshold, 15 ether);
    }
}
