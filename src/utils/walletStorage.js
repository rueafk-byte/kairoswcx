// Client-side wallet storage with localStorage
class WalletStorage {
  constructor() {
    this.storageKey = 'kairos-wallets';
    this.initStorage();
  }

  initStorage() {
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
      this.saveWallets(sampleWallets);
    }
  }

  getWallets() {
    try {
      const wallets = localStorage.getItem(this.storageKey);
      return wallets ? JSON.parse(wallets) : [];
    } catch (error) {
      console.error('Error loading wallets:', error);
      return [];
    }
  }

  saveWallets(wallets) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(wallets));
      return true;
    } catch (error) {
      console.error('Error saving wallets:', error);
      return false;
    }
  }

  addWallet(twitterHandle, walletAddress) {
    const wallets = this.getWallets();
    
    // Check if wallet already exists
    const exists = wallets.some(w => 
      w.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (exists) {
      return {
        success: false,
        message: 'Wallet address already exists'
      };
    }

    const newWallet = {
      id: wallets.length + 1,
      twitterHandle: twitterHandle.trim(),
      walletAddress: walletAddress.trim(),
      timestamp: new Date().toISOString()
    };

    wallets.push(newWallet);
    
    if (this.saveWallets(wallets)) {
      return {
        success: true,
        message: 'Wallet added successfully',
        data: newWallet
      };
    } else {
      return {
        success: false,
        message: 'Failed to save wallet'
      };
    }
  }

  clearWallets() {
    try {
      localStorage.removeItem(this.storageKey);
      this.initStorage(); // Reinitialize with sample data
      return true;
    } catch (error) {
      console.error('Error clearing wallets:', error);
      return false;
    }
  }

  getStats() {
    const wallets = this.getWallets();
    const today = new Date().toDateString();
    const todayCount = wallets.filter(w => 
      new Date(w.timestamp).toDateString() === today
    ).length;
    
    const uniqueHandles = new Set(
      wallets.map(w => w.twitterHandle.toLowerCase())
    ).size;

    return {
      total: wallets.length,
      today: todayCount,
      uniqueUsers: uniqueHandles
    };
  }
}

export default WalletStorage;