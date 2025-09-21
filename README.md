# HyperWallet Collector - Kairos Prediction Game

A wallet collection website for the Kairos Prediction Game on Hyperliquid chain, built with Astro and TailwindCSS.

## 🚀 Project Structure

```text
/
├── public/
├── src/
│   ├── data/              # Data storage (JSON files)
│   ├── pages/             # Website pages and API endpoints
│   │   ├── api/           # API endpoints
│   │   │   └── admin/     # Admin API endpoints
│   │   ├── index.astro    # Main wallet collection page
│   │   └── admin.astro    # Admin dashboard
│   ├── styles/            # Global CSS styles
│   └── utils/             # Utility functions
├── package.json
└── README.md
```

## 🎯 Features

- **Wallet Collection Form**: Collect Twitter handles and EVM wallet addresses
- **Data Storage**: Stores submissions in a PostgreSQL database
- **Admin Dashboard**: Password-protected admin page to view submissions and export data
- **Validation**: Validates EVM wallet address format and prevents duplicates
- **Live Counter**: Shows real-time count of collected wallets
- **Responsive Design**: Works on mobile and desktop
- **Cosmic Theme**: Dark theme with subtle gradients and floating stars animation

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run db:init`         | Initialize the database tables                   |
| `npm run db:migrate`      | Migrate existing data from JSON to database      |

## 🚀 Deployment

### Prerequisites
1. **Database**: Set up a PostgreSQL database (recommended: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
2. **GitHub Account**: For version control
3. **Vercel Account**: For hosting

### Environment Variables
Set these in your Vercel project settings:
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### Deployment Steps

#### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/hyperwalletcollector.git
git push -u origin main
```

#### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables in Vercel dashboard
5. Deploy!

#### 3. Database Setup
Your database will be automatically initialized on first deployment.

### Production URLs
- **Main Site**: Your wallet collection form
- **Admin Panel**: `/admin` - View submissions and export data

## 🔧 Database Setup

1. Create a PostgreSQL database
2. Copy `.env.example` to `.env` and update the `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/walletcollector
   ```
3. Run `npm run db:init` to create the required tables
4. (Optional) Run `npm run db:migrate` to migrate existing data from JSON files

## 🔐 Admin Access

To access the admin dashboard, navigate to `/admin` and use the password:
```
admin123
```

> ⚠️ For production use, change this password in `src/pages/api/admin-password.js`

## 📤 Exporting Data

From the admin dashboard, you can export all wallet submissions as a CSV file.

## 🛠️ Technology Stack

- [Astro](https://astro.build/) - Static site generator
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [PostgreSQL](https://www.postgresql.org/) - Database for storing wallet data
- Vanilla JavaScript - For interactive components

## 🚀 Deployment

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).