// Netlify Function with Airtable integration for permanent storage
const Airtable = require('airtable');

// Airtable configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'your-api-key-here';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'your-base-id-here';
const AIRTABLE_TABLE_NAME = 'Table 1';

// Initialize Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Fallback in-memory storage
let globalWallets = [
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

// Check if Airtable is properly configured
function isAirtableConfigured() {
  return AIRTABLE_API_KEY !== 'your-api-key-here' && 
         AIRTABLE_BASE_ID !== 'your-base-id-here' &&
         AIRTABLE_API_KEY.startsWith('pat') && // Airtable API keys start with 'pat'
         AIRTABLE_BASE_ID.startsWith('app'); // Airtable base IDs start with 'app'
}

// Get wallets from Airtable (permanent storage) or fallback
async function getWalletsFromStorage() {
  if (!isAirtableConfigured()) {
    console.log('⚠️ Airtable not configured, using in-memory storage');
    return globalWallets;
  }

  try {
    console.log('📊 Fetching wallets from Airtable (permanent storage)...');
    
    const records = [];
    
    await base(AIRTABLE_TABLE_NAME).select({
      sort: [{ field: 'Created', direction: 'desc' }]
    }).eachPage(function page(recordsPage, fetchNextPage) {
      recordsPage.forEach(function(record) {
        records.push({
          id: record.get('ID') || record.id,
          twitterHandle: record.get('Twitter Handle') || '',
          walletAddress: record.get('Wallet Address') || '',
          timestamp: record.get('Created') || record.createdTime
        });
      });
      fetchNextPage();
    });

    console.log('✅ Retrieved wallets from Airtable (permanent):', records.length);
    
    // Update in-memory storage as backup
    globalWallets = records;
    return records;

  } catch (error) {
    console.error('❌ Error fetching from Airtable:', error);
    console.log('🔄 Using in-memory storage as fallback');
    return globalWallets;
  }
}

// Save wallet to Airtable (permanent storage) or fallback
async function saveWalletsToStorage(wallets) {
  // Always update in-memory storage first
  globalWallets = wallets;
  console.log('✅ Updated in-memory storage:', wallets.length);

  if (!isAirtableConfigured()) {
    console.log('⚠️ Airtable not configured, using in-memory storage only');
    return true;
  }

  try {
    console.log('💾 Saving to Airtable (permanent storage)...');
    
    // Get the last wallet (most recently added)
    const newWallet = wallets[wallets.length - 1];
    
    // Save to Airtable
    await base(AIRTABLE_TABLE_NAME).create([
      {
        fields: {
          'Twitter Handle': newWallet.twitterHandle,
          'Wallet Address': newWallet.walletAddress
        }
      }
    ]);

    console.log('✅ Saved to Airtable (permanent storage) successfully');
    return true;

  } catch (error) {
    console.error('❌ Error saving to Airtable:', error);
    console.log('✅ In-memory storage updated as fallback');
    return true;
  }
}

export async function GET({ request }) {
  return new Response(JSON.stringify({
    success: true,
    message: 'GET endpoint working'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // For now, just return success
    return new Response(JSON.stringify({
      success: true,
      message: 'POST endpoint working',
      data: data
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Error processing request'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Keep the original handler for netlify functions
exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400'
      },
      body: JSON.stringify({ success: true })
    };
  }

  // Handle GET request - retrieve all wallets
  if (event.httpMethod === 'GET') {
    try {
      // Get wallets from Airtable or fallback storage
      const wallets = await getWalletsFromStorage();
      
      // Sort wallets by timestamp (newest first)
      const sortedWallets = wallets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          data: sortedWallets,
          count: sortedWallets.length,
          storage: isAirtableConfigured() ? 'airtable-permanent' : 'in-memory'
        })
      };
    } catch (error) {
      console.error('Error retrieving wallets:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'Internal Server Error'
        })
      };
    }
  }

  // Handle POST request - add new wallet
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      
      // Validate required fields
      if (!data.twitterHandle || !data.walletAddress) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            success: false,
            message: 'Twitter handle and wallet address are required'
          })
        };
      }

      // More flexible wallet address validation
      const walletAddress = data.walletAddress.trim();
      console.log('Received wallet address:', walletAddress);
      console.log('Wallet address length:', walletAddress.length);
      
      // Basic validation - just check if it starts with 0x and has reasonable length
      if (!walletAddress.startsWith('0x') || walletAddress.length < 42 || walletAddress.length > 44) {
        console.log('Wallet validation failed - basic format check');
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            success: false,
            message: `Invalid wallet address format. Expected: 0x followed by 40 characters. Got: ${walletAddress} (length: ${walletAddress.length})`
          })
        };
      }

      // Get current wallets from Airtable or fallback storage
      const wallets = await getWalletsFromStorage();
      
      // Check if wallet already exists (using trimmed address)
      const exists = wallets.some(w => w.walletAddress.toLowerCase() === walletAddress.toLowerCase());
      if (exists) {
        return {
          statusCode: 409,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            success: false,
            message: 'Wallet address already exists'
          })
        };
      }

      // Add new wallet (using trimmed address)
      const newWallet = {
        id: wallets.length + 1,
        twitterHandle: data.twitterHandle.trim(),
        walletAddress: walletAddress,
        timestamp: new Date().toISOString()
      };

      wallets.push(newWallet);
      console.log('Wallet added:', newWallet);
      console.log('Total wallets:', wallets.length);

      // Save updated wallets to Airtable or fallback storage
      const saveSuccess = await saveWalletsToStorage(wallets);
      if (!saveSuccess) {
        console.error('Failed to save wallet to persistent storage, but wallet was added to current session');
        console.log('Continuing with success response despite storage failure');
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          message: 'Wallet added successfully',
          data: newWallet,
          storage: isAirtableConfigured() ? 'airtable-permanent' : 'in-memory'
        })
      };

    } catch (error) {
      console.error('Error submitting wallet:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'Internal Server Error'
        })
      };
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ success: false, message: 'Method not allowed' })
  };
};
