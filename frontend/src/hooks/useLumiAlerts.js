import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { LUMI_ALERTS_ADDRESS, LUMI_ALERTS_ABI, BLOCKDAG_NETWORK } from '../contracts/LumiAlerts';

export function useLumiAlerts() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner();
      const _contract = new ethers.Contract(
        LUMI_ALERTS_ADDRESS, 
        LUMI_ALERTS_ABI, 
        _signer
      );

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);
      setAccount(accounts[0]);

      // Switch to BlockDAG network if needed
      await switchToBlockDAG();
      
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  // Switch to BlockDAG network
  const switchToBlockDAG = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BLOCKDAG_NETWORK.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${BLOCKDAG_NETWORK.chainId.toString(16)}`,
              chainName: BLOCKDAG_NETWORK.chainName,
              rpcUrls: BLOCKDAG_NETWORK.rpcUrls,
              blockExplorerUrls: BLOCKDAG_NETWORK.blockExplorerUrls,
              nativeCurrency: BLOCKDAG_NETWORK.nativeCurrency
            }]
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw addError;
        }
      }
    }
  };

  // Create alert
  const createAlert = async (alertType, threshold) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const thresholdWei = ethers.parseEther(threshold.toString());
      const tx = await contract.createAlert(alertType, thresholdWei);
      await tx.wait();
      await fetchAlerts();
      return tx;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove alert
  const removeAlert = async (alertId) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const tx = await contract.removeAlert(alertId);
      await tx.wait();
      await fetchAlerts();
      return tx;
    } catch (error) {
      console.error('Error removing alert:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update alert
  const updateAlert = async (alertId, newThreshold) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const thresholdWei = ethers.parseEther(newThreshold.toString());
      const tx = await contract.updateAlert(alertId, thresholdWei);
      await tx.wait();
      await fetchAlerts();
      return tx;
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user alerts
  const fetchAlerts = async () => {
    if (!contract || !account) return;
    
    setLoading(true);
    try {
      const userAlerts = await contract.getUserAlerts(account);
      const formatted = userAlerts.map(alert => ({
        id: alert.id.toString(),
        user: alert.user,
        alertType: Number(alert.alertType),
        threshold: ethers.formatEther(alert.threshold),
        active: alert.active,
        createdAt: new Date(Number(alert.createdAt) * 1000)
      }));
      setAlerts(formatted);
      return formatted;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Listen for events
  useEffect(() => {
    if (!contract || !account) return;

    const alertCreatedFilter = contract.filters.AlertCreated(account);
    const alertTriggeredFilter = contract.filters.AlertTriggered(account);
    const alertRemovedFilter = contract.filters.AlertRemoved(account);

    contract.on(alertCreatedFilter, () => fetchAlerts());
    contract.on(alertTriggeredFilter, (user, alertId, alertType, currentValue, threshold) => {
      console.log('Alert Triggered!', { alertId, alertType, currentValue, threshold });
      // You can show a notification here
    });
    contract.on(alertRemovedFilter, () => fetchAlerts());

    return () => {
      contract.removeAllListeners();
    };
  }, [contract, account]);

  return {
    account,
    alerts,
    loading,
    connectWallet,
    createAlert,
    removeAlert,
    updateAlert,
    fetchAlerts
  };
}