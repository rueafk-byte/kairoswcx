// Client-side storage utility for static site generation
export class WalletStorage {
  constructor() {
    this.storageKey = 'kairoswcx-wallets';
  }

  // Get all wallets from localStorage
  getWallets() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading wallets:', error);
      return [];
    }
  }

  // Add a new wallet
  addWallet(walletData) {
    try {
      const wallets = this.getWallets();
      
      // Check if wallet already exists
      const exists = wallets.some(w => w.walletAddress === walletData.walletAddress);
      if (exists) {
        return {
          success: false,
          message: 'Wallet address already exists'
        };
      }

      // Add new wallet
      const newWallet = {
        id: wallets.length + 1,
        twitterHandle: walletData.twitterHandle,
        walletAddress: walletData.walletAddress,
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

  // Get wallet count
  getWalletCount() {
    return this.getWallets().length;
  }

  // Clear all wallets (for testing)
  clearWallets() {
    localStorage.removeItem(this.storageKey);
  }
}

// Export a singleton instance
export const walletStorage = new WalletStorage();
