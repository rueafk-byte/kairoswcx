// Supabase configuration for worldwide storage
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://your-project.supabase.co' // Replace with your Supabase URL
const supabaseKey = 'your-anon-key' // Replace with your Supabase anon key

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Wallet operations
export const walletService = {
  // Add new wallet
  async addWallet(twitterHandle, walletAddress) {
    try {
      // Check if wallet already exists
      const { data: existingWallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()

      if (existingWallet) {
        return {
          success: false,
          message: 'Wallet address already exists'
        }
      }

      // Insert new wallet
      const { data, error } = await supabase
        .from('wallets')
        .insert([
          {
            twitter_handle: twitterHandle.trim(),
            wallet_address: walletAddress.trim().toLowerCase(),
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        return {
          success: false,
          message: 'Failed to save wallet to worldwide database'
        }
      }

      return {
        success: true,
        message: 'Wallet added successfully to worldwide database!',
        data: data[0]
      }

    } catch (error) {
      console.error('Error adding wallet:', error)
      return {
        success: false,
        message: 'Failed to save wallet'
      }
    }
  },

  // Get all wallets
  async getWallets() {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error loading wallets:', error)
      return []
    }
  }
}
