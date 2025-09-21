// Simple client-side wallet storage
class WalletStorage {
  constructor() {
    this.storageKey = 'kairos-wallets';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      // Initialize with sample data
      const sampleWallets = [
        {
          id: 1,
          twitterHandle: '@rrt',
          walletAddress: '0xDc58817d88F6f353eb7D54cd0FA6F438B2c0814e',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          twitterHandle: '@rr',
          walletAddress: '0x7DC58DBac9A94291A814b5A5D0180489bD697683',
          timestamp: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(sampleWallets));
    }
  }

  getAllWallets() {
    try {
      const wallets = localStorage.getItem(this.storageKey);
      return wallets ? JSON.parse(wallets) : [];
    } catch (error) {
      console.error('Error getting wallets:', error);
      return [];
    }
  }

  addWallet(walletData) {
    try {
      const wallets = this.getAllWallets();
      
      // Check if wallet already exists
      const exists = wallets.some(w => 
        w.walletAddress.toLowerCase() === walletData.walletAddress.toLowerCase()
      );
      
      if (exists) {
        return {
          success: false,
          message: 'Wallet address already exists'
        };
      }

      const newWallet = {
        id: Date.now(),
        twitterHandle: walletData.twitterHandle.trim(),
        walletAddress: walletData.walletAddress.trim(),
        timestamp: new Date().toISOString()
      };

      wallets.push(newWallet);
      localStorage.setItem(this.storageKey, JSON.stringify(wallets));

      return {
        success: true,
        message: 'Wallet added successfully',
        data: newWallet
      };
    } catch (error) {
      console.error('Error adding wallet:', error);
      return {
        success: false,
        message: 'Failed to add wallet'
      };
    }
  }

  clearAllWallets() {
    try {
      localStorage.removeItem(this.storageKey);
      this.initializeStorage();
      return {
        success: true,
        message: 'All wallets cleared'
      };
    } catch (error) {
      console.error('Error clearing wallets:', error);
      return {
        success: false,
        message: 'Failed to clear wallets'
      };
    }
  }
}

export default WalletStorage;
