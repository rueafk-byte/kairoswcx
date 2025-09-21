// Simple in-memory storage for wallet data
let fallbackStorage = [];

// For now, we'll use only in-memory storage to ensure Vercel deployment works
// Database support can be added later once the basic deployment is working

// Initialize database tables (simplified for Vercel deployment)
export async function initializeDatabase() {
  console.log('Using in-memory storage for wallet data');
  console.log('Database initialized successfully!');
}

// Add a new wallet entry (simplified for Vercel deployment)
export async function addWallet(walletData) {
  // Check if wallet already exists
  const exists = fallbackStorage.some(w => w.walletAddress === walletData.walletAddress);
  if (exists) {
    return {
      success: false,
      message: 'Wallet address already exists'
    };
  }

  // Add to storage
  const newWallet = {
    id: fallbackStorage.length + 1,
    twitterHandle: walletData.twitterHandle,
    walletAddress: walletData.walletAddress,
    timestamp: new Date().toISOString()
  };

  fallbackStorage.push(newWallet);

  return {
    success: true,
    message: 'Wallet added successfully',
    data: newWallet
  };
}

// Get all wallets (simplified for Vercel deployment)
export async function getAllWallets() {
  return fallbackStorage.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Get wallet count (simplified for Vercel deployment)
export async function getWalletCount() {
  return fallbackStorage.length;
}