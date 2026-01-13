# Developer Setup Guide

Step-by-step instructions to get the TabPay backend running locally.

## Prerequisites

Before starting, ensure you have installed:

| Tool | Version | Check Command | Install |
|------|---------|---------------|---------|
| Node.js | 18+ | `node --version` | [nodejs.org](https://nodejs.org) |
| npm | 9+ | `npm --version` | Comes with Node |
| PostgreSQL | 14+ | `psql --version` | See below |
| Git | Any | `git --version` | [git-scm.com](https://git-scm.com) |

### Installing PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**macOS (Postgres.app) - Easiest:**
1. Download from [postgresapp.com](https://postgresapp.com)
2. Drag to Applications
3. Open and click "Initialize"

**Windows:**
1. Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer, remember the password you set for `postgres` user

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Setup Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/Benmore-Studio/BEN137-tabpay.git
cd BEN137-tabpay/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will:
- Install all npm packages
- Auto-generate Prisma client (via `postinstall` script)

### Step 3: Create PostgreSQL Database

**Option A: Using psql command line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database (in psql prompt)
CREATE DATABASE tabpay;

# Exit
\q
```

**Option B: Using createdb command**
```bash
createdb -U postgres tabpay
```

**Option C: Using Postgres.app (macOS)**
1. Click the elephant icon in menu bar
2. Double-click "postgres" database to open psql
3. Run: `CREATE DATABASE tabpay;`

### Step 4: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your database credentials:

```bash
# If using default postgres user with no password (common on macOS)
DATABASE_URL="postgresql://postgres@localhost:5432/tabpay?schema=public"

# If using postgres user with password
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/tabpay?schema=public"

# If using a different user
DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/tabpay?schema=public"
```

**Database URL Format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Step 5: Push Database Schema

```bash
npm run db:push
```

This creates all tables in your database based on `prisma/schema.prisma`.

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Your database is now in sync with your Prisma schema.
```

### Step 6: Seed Demo Data

```bash
npm run db:seed
```

This populates the database with:
- 1 demo venue (Potawatomi Casino)
- 4 service bars
- 6 menu categories
- 25+ menu items
- Modifiers (Size, Ice, Garnish, etc.)

### Step 7: Verify Setup

```bash
# Start the development server
npm run dev
```

**Expected output:**
```
TabPay Backend running on port 3000
```

**Test the API:**
```bash
# In another terminal
curl http://localhost:3000/

# Should return:
{"status":"healthy","service":"TabPay Backend","version":"1.0.0"}
```

**Test database connection:**
```bash
curl http://localhost:3000/health

# Should return:
{"status":"healthy","database":"connected"}
```

### Step 8: Explore with Prisma Studio (Optional)

```bash
npm run db:studio
```

Opens a visual database browser at `http://localhost:5555` where you can:
- View all tables and data
- Add/edit/delete records
- Explore relationships

## Troubleshooting

### "Connection refused" error

**Problem:** Can't connect to PostgreSQL
```
Error: P1001: Can't reach database server at `localhost`:`5432`
```

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql

   # Linux
   sudo systemctl status postgresql
   ```

2. Start PostgreSQL:
   ```bash
   # macOS
   brew services start postgresql@14

   # Linux
   sudo systemctl start postgresql
   ```

### "Database does not exist" error

**Problem:** Database "tabpay" not found
```
Error: P1003: Database `tabpay` does not exist
```

**Solution:** Create the database (Step 3)

### "Authentication failed" error

**Problem:** Wrong username/password
```
Error: P1000: Authentication failed against database server
```

**Solutions:**
1. Check your DATABASE_URL in `.env`
2. Verify username/password are correct
3. Try connecting directly: `psql -U postgres -d tabpay`

### "Permission denied" error (Linux)

**Problem:** Can't connect as postgres user

**Solution:** Use peer authentication or create a new user:
```bash
sudo -u postgres psql
CREATE USER yourname WITH PASSWORD 'yourpassword' CREATEDB;
\q
```

Then update DATABASE_URL to use your username.

### Port 3000 already in use

**Problem:** Another process is using port 3000

**Solutions:**
1. Find and kill the process:
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. Or use a different port:
   ```bash
   PORT=3001 npm run dev
   ```

### Prisma client not found

**Problem:** `Cannot find module '@prisma/client'`

**Solution:** Regenerate the client:
```bash
npm run db:generate
```

## Verifying Everything Works

Run through this checklist:

- [ ] `npm run dev` starts without errors
- [ ] `curl http://localhost:3000/` returns healthy status
- [ ] `curl http://localhost:3000/health` shows database connected
- [ ] `npm run db:studio` opens Prisma Studio
- [ ] You can see seeded data in Prisma Studio

## Next Steps

Once setup is complete:

1. Read [README.md](./README.md) for API overview
2. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for code standards
3. Review [SPRINT_1.md](./SPRINT_1.md) for your assigned tickets
4. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

## Getting Help

1. Check this troubleshooting section first
2. Search existing issues on GitHub
3. Ask in the team Slack channel
4. Create a GitHub issue with:
   - Your OS and version
   - Node/npm versions
   - Full error message
   - Steps to reproduce
