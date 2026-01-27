# CUHK Coffee Delivery App 🚀

A student-led coffee delivery platform for CUHK campus built with Next.js and Supabase.

## ✅ What's Included

- 🔐 **Authentication** - CUHK email verification
- ☕ **Menu System** - Browse products and add to cart
- 🛒 **Order Placement** - Select delivery location and payment method
- 📍 **Real-time Tracking** - Live order status updates
- 🚴 **Delivery Partner App** - Accept and manage deliveries
- 👤 **User Profiles** - Manage account and view order history

## 📋 Prerequisites

- Node.js 18+ installed
- VS Code (or any code editor)
- A Supabase account (free, no credit card!)

## 🚀 Step-by-Step Setup

### 1. Initial Setup (Already Done!)

You should have already run:
```bash
npx create-next-app@latest cuhk-coffee-delivery
cd cuhk-coffee-delivery
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npx shadcn@latest init
npx shadcn@latest add button card input label select badge toast switch
npm install lucide-react date-fns
```

### 2. Create Supabase Project

1. Go to https://supabase.com
2. Sign up (no credit card needed!)
3. Create new project:
   - Name: `cuhk-coffee-delivery`
   - Database Password: (create and SAVE it!)
   - Region: Singapore
4. Wait 2 minutes for setup

### 3. Get Your Supabase Keys

1. In Supabase dashboard, click Settings (bottom left)
2. Click "API"
3. Copy:
   - `Project URL`
   - `anon public` key

### 4. Create `.env.local` File

Create a file called `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with YOUR actual values!

### 5. Set Up Database

1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Copy-paste the entire SQL from the database setup file
4. Click "Run"
5. Should see "Success. No rows returned"

### 6. Copy All Code Files

Copy all the code files I provided into your project:

```
lib/
  ├── supabase.ts
  └── types.ts

components/
  └── Header.tsx

app/
  ├── layout.tsx (replace existing)
  ├── page.tsx (replace existing)
  ├── auth/
  │   ├── login/page.tsx
  │   ├── signup/page.tsx
  │   └── callback/route.ts
  ├── menu/page.tsx
  ├── order/[id]/page.tsx
  ├── delivery/page.tsx
  └── profile/page.tsx
```

### 7. Install Missing shadcn Component

One component we need:

```bash
npx shadcn@latest add switch
```

### 8. Run the App!

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## 📱 How to Test

### Test as Customer:

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Use a CUHK email format (anything@link.cuhk.edu.hk works locally)
4. Fill in details and sign up
5. Check your email for verification (check spam!)
6. Click verification link
7. Go to Menu → Add items → Place order
8. Track your order in real-time!

### Test as Delivery Partner:

1. Sign up with a different email
2. Go to "Delivery" page
3. Click "Become a delivery partner"
4. Toggle online
5. Accept orders
6. Update order status

## 🎯 Features Breakdown

### Customer Flow:
1. Sign up with CUHK email
2. Browse menu
3. Add items to cart
4. Select delivery location (campus zone)
5. Choose payment method (Cash/FPS/PayMe)
6. Place order
7. Track in real-time

### Delivery Partner Flow:
1. Sign up as customer first
2. Go to Delivery page
3. Become delivery partner
4. Toggle online
5. See available orders
6. Accept order
7. Update status (picked up → delivered)

## 🔧 Common Issues & Fixes

### "Module not found" errors
```bash
npm install
```

### Supabase connection error
- Check your `.env.local` file
- Make sure keys are correct
- Restart dev server

### Can't sign up
- Check if you used @link.cuhk.edu.hk email
- Check Supabase email settings
- Look for errors in browser console

### Database errors
- Make sure you ran the SQL setup
- Check Supabase dashboard → Database → Tables
- Should see: users, products, orders, order_items, campus_zones

## 🎨 Customize

### Add More Products:
1. Go to Supabase dashboard
2. Click "Table Editor"
3. Click "products"
4. Click "Insert row"
5. Add your product!

### Add More Campus Zones:
Same process, but use "campus_zones" table

### Change Colors:
Edit `app/globals.css` - look for the CSS variables

## 📦 Deploy (Free!)

### Deploy to Vercel:
```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts and add your environment variables!

## 🆘 Need Help?

Common commands:
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint
```

## 📝 What's Next?

### Phase 2 Features (Optional):
- [ ] Push notifications (OneSignal)
- [ ] Payment integration (Stripe)
- [ ] Rating system
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Photo upload for payment proof

## 🎉 You're Done!

You now have a fully functional coffee delivery app!

Start the server with `npm run dev` and test it out!

---

**Built with:** Next.js 14, Supabase, shadcn/ui, Tailwind CSS
**Total Cost:** $0/month (Free tier!)

=============================================================================================


# Tech Stack Breakdown 🚀

Great question! Let me break down exactly what we're using:

---

## 🎨 **FRONTEND (What users see)**

### **Main Framework:**
- **Next.js 14** (App Router)
  - React-based framework
  - Handles routing, pages, and components
  - Server-side rendering + client-side rendering

### **UI Layer:**
- **React** - Component library (included in Next.js)
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - Pre-built accessible React components
- **Lucide React** - Icon library

### **Frontend Does:**
- ✅ Display pages (home, menu, orders)
- ✅ Handle user interactions (clicks, forms)
- ✅ Real-time UI updates
- ✅ Client-side navigation
- ✅ Form validation
- ✅ State management (React hooks)

---

## ⚙️ **BACKEND (What handles data)**

### **Main Backend:**
- **Supabase** - Backend-as-a-Service (BaaS)
  - Built on PostgreSQL database
  - Provides REST API automatically
  - Real-time subscriptions via WebSockets
  - Authentication system
  - File storage
  - Row Level Security (RLS)

### **Backend Does:**
- ✅ Store all data (users, orders, products)
- ✅ Handle authentication (login/signup)
- ✅ Validate database operations
- ✅ Real-time updates (order status changes)
- ✅ Security (who can read/write what)
- ✅ File storage (future: payment proofs)

---

## 📊 **Architecture Diagram**

```
┌─────────────────────────────────────────┐
│           USER'S BROWSER                │
│  (Chrome, Safari, etc.)                 │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼──────────────────────────┐
│         FRONTEND (Vercel)               │
│  Next.js 14 + React + TypeScript        │
│  - Pages & Components                   │
│  - User Interface                       │
│  - Client-side Logic                    │
└──────────────┬──────────────────────────┘
               │
               │ API Calls
               │ (REST + WebSocket)
               │
┌──────────────▼──────────────────────────┐
│        BACKEND (Supabase)               │
│  PostgreSQL Database                    │
│  - Users, Orders, Products              │
│  - Authentication                       │
│  - Real-time Subscriptions              │
│  - Row Level Security                   │
└─────────────────────────────────────────┘
```

---

## 🔄 **How They Work Together**

### **Example: Placing an Order**

```
1. USER: Clicks "Place Order" button
   ↓
2. FRONTEND (React): 
   - Validates form
   - Shows loading state
   ↓
3. FRONTEND → BACKEND:
   - Sends order data via Supabase client
   - POST request to Supabase API
   ↓
4. BACKEND (Supabase):
   - Validates user is authenticated
   - Checks RLS policies
   - Inserts order into database
   - Returns order ID
   ↓
5. BACKEND → FRONTEND:
   - Returns success response
   ↓
6. FRONTEND:
   - Redirects to order tracking page
   - Subscribes to real-time updates
   ↓
7. DELIVERY PARTNER accepts order:
   - Updates order in database
   ↓
8. BACKEND → FRONTEND (Real-time):
   - WebSocket pushes update
   - Order status changes automatically
```

---

## 📦 **Complete Tech Stack**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Language** | TypeScript | Type-safe JavaScript |
| **Framework** | Next.js 14 | Full-stack React framework |
| **UI Library** | React 18 | Component-based UI |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Components** | shadcn/ui | Pre-built React components |
| **Icons** | Lucide React | Icon library |
| **Database** | PostgreSQL | Relational database (via Supabase) |
| **Backend** | Supabase | BaaS (auth, API, real-time) |
| **Authentication** | Supabase Auth | Email/password auth |
| **Real-time** | Supabase Realtime | WebSocket subscriptions |
| **Storage** | Supabase Storage | File uploads (future) |
| **Hosting** | Vercel | Frontend deployment |
| **Version Control** | Git + GitHub | Code management |

---

## 🤔 **Why This Stack?**

### **Frontend: Next.js + React**
- ✅ Most popular React framework
- ✅ Great documentation
- ✅ Easy deployment to Vercel
- ✅ Server-side rendering for SEO
- ✅ Built-in routing

### **Backend: Supabase**
- ✅ **100% FREE** (no credit card!)
- ✅ PostgreSQL (industry standard)
- ✅ Auto-generated REST API
- ✅ Real-time built-in
- ✅ Authentication included
- ✅ Easy to use
- ✅ Great for students/beginners

### **Styling: Tailwind + shadcn/ui**
- ✅ Fast development
- ✅ Professional-looking UI
- ✅ Responsive by default
- ✅ Highly customizable

---

## 💰 **Cost Breakdown**

| Service | Plan | Cost |
|---------|------|------|
| Supabase | Free Tier | $0/month |
| Vercel | Hobby | $0/month |
| Next.js | Open Source | $0/month |
| React | Open Source | $0/month |
| Tailwind | Open Source | $0/month |
| shadcn/ui | Open Source | $0/month |
| **TOTAL** | | **$0/month** 🎉 |

---

## 🔐 **Security Features**

### **Supabase Row Level Security (RLS):**
```sql
-- Example: Users can only see their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);
```

This means:
- Security is enforced at **database level**
- Not in your code (more secure!)
- Can't be bypassed by API calls
- Users can't access other users' data

---

## 🚀 **Scalability**

### **Current Setup Handles:**
- ✅ 500-1000 users
- ✅ 100-200 orders/day
- ✅ 10-20 concurrent delivery partners
- ✅ Real-time updates for all users

### **To Scale Beyond (if needed):**
- Upgrade Supabase to Pro ($25/month)
- Add caching layer (Redis)
- Optimize database queries
- Add CDN for static assets

---

## 📚 **Learning Resources**

If you want to learn more:

- **Next.js**: https://nextjs.org/learn
- **React**: https://react.dev/learn
- **Supabase**: https://supabase.com/docs
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 🎯 **Summary**

**Frontend (Client-side):**
- Next.js + React + TypeScript + Tailwind
- Runs in user's browser
- Handles UI and user interactions

**Backend (Server-side):**
- Supabase (PostgreSQL database)
- Runs on Supabase's servers
- Handles data storage, authentication, and business logic

**They talk via:**
- REST API calls
- WebSocket (real-time updates)
- Supabase JavaScript client library

---

**Does this make sense? Any specific part you want me to explain more?** 😊