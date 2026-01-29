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


=============================================================================================


# Ultra Fast Testing Mode - Complete Guide 🚀

## Overview
This update speeds up testing from 5+ minutes to just **30 SECONDS**! Perfect for rapid iteration and demos.

---

## What Changed

| Feature | Old | New | Improvement |
|---------|-----|-----|-------------|
| **Total route time** | 5 minutes | 30 seconds | **10x faster** ⚡ |
| **Location updates** | Every 5s | Every 2s | **2.5x faster** |
| **Customer map refresh** | Every 10s | Every 1s | **10x faster** |
| **Waypoints** | 11 points | 15 points | More detailed |
| **Time to café** | ~25 seconds | 8 seconds | **3x faster** |
| **Time to customer** | ~30 seconds | 20 seconds | **1.5x faster** |

---

## File Structure

```
app/
├── delivery/
│   └── page.tsx              ← Updated with 30-second route
├── order/
│   └── [id]/
│       └── page.tsx          ← Updated with 1-second refresh
└── components/
    └── Map.tsx               ← No changes needed
```

---

## Installation Instructions

### Step 1: Update Delivery Partner Page
Replace the contents of `app/delivery/page.tsx` with the `delivery-page.tsx` file provided.

**Key changes:**
- Ultra-fast simulation mode (30 seconds total)
- Location updates every 2 seconds
- 15 waypoints with detailed progress
- Console logging for debugging
- Visual testing mode banner

### Step 2: Update Order Tracking Page
Replace the contents of `app/order/[id]/page.tsx` with the `order-tracking-page.tsx` file provided.

**Key changes:**
- Map refreshes every 1 second (instead of 10)
- Real-time location updates
- Visual testing mode banner
- Improved status display

### Step 3: Deploy
```bash
# Commit changes
git add .
git commit -m "Add ultra-fast testing mode (30s route + 1s refresh)"

# Push to production
git push
```

---

## Testing Timeline

### ⏱️ Complete 30-Second Journey

```
Time    Step  Location                    Action
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
00:00   1     🏥 Medical Building START   Accept order
00:02   2     🚶💨 Fast walking           
00:04   3     🚶💨 Rushing                
00:06   4     🚶💨 Almost there           
00:08   5     ☕ AT CAFÉ - PICKUP!       👉 Click "Mark as Picked Up"
00:10   6     📦 PICKED UP - GO!          
00:12   7     🚶💨 Speed walking          
00:14   8     🚶💨 Fast pace             
00:16   9     🚶💨 Rushing                
00:18   10    🚶💨 Quick steps            
00:20   11    🚶💨 Nearly there           
00:22   12    🚶💨 Final sprint           
00:24   13    🚶💨 Almost arrived         
00:26   14    🚶💨 At entrance            
00:28   15    🎯 ARRIVED NEW ASIA!        👉 Click "Mark as Delivered"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 30 SECONDS! ✅
```

---

## Testing Instructions

### Setup (Use 2 Browser Windows)

#### Window 1: Delivery Partner (Incognito/Private Mode)
```
1. Open incognito/private window
2. Go to your-app.com/auth
3. Sign in as delivery partner
4. Navigate to /delivery
5. Toggle "Go Online"
```

#### Window 2: Customer (Regular Browser)
```
1. Open regular browser
2. Go to your-app.com
3. Place an order:
   - Pickup: CUHK Café
   - Delivery: New Asia College
   - Items: Coffee, Sandwich
   - Total: HK$50
```

### Testing Flow

#### 1. Start Test (Delivery Partner Window)
- See the new order appear
- Click "Accept Order"
- Watch console for progress logs

#### 2. Monitor Progress (Both Windows)

**Delivery Partner Console Output:**
```
🧪 TESTING MODE ENABLED: ULTRA FAST delivery simulation
📦 Active orders: 1
⚡ SPEED MODE: Complete route in 30 SECONDS!
📍 Updates every 2 seconds (15 steps × 2s = 30s)

⚡ Step 1/15 [0s elapsed, 28s remaining]
📍 🏥 Medical Building START
   22.41952, 114.20545
   ✅ Updated order #abc12345

⚡ Step 2/15 [2s elapsed, 26s remaining]
📍 🚶💨 Fast walking
   22.41920, 114.20520
   ✅ Updated order #abc12345

...

⚡ Step 5/15 [8s elapsed, 20s remaining]
📍 ☕ AT CAFÉ - PICKUP!
   22.418461, 114.204712
   ✅ Updated order #abc12345
   💡 Click "Mark as Picked Up" NOW!
```

#### 3. Customer Window
- Green banner shows "ULTRA FAST Testing Mode"
- Map refreshes every 1 second
- Blue marker moves smoothly every 2 seconds
- Watch it zoom from Medical Building → Café → New Asia!

#### 4. Action Points

**At 8 seconds (Delivery Partner):**
- Console shows: `💡 Click "Mark as Picked Up" NOW!`
- Click the green "Mark as Picked Up" button
- Status changes to "picked_up"

**At 28 seconds (Delivery Partner):**
- Console shows: `💡 Click "Mark as Delivered" NOW!`
- Click the purple "Mark as Delivered" button
- Order completes!

**Customer sees:**
- Real-time map updates (every 1 second)
- Status changes immediately
- Timeline updates automatically

---

## Console Output Examples

### Successful Test Run
```
🧪 TESTING MODE ENABLED: ULTRA FAST delivery simulation
📦 Active orders: 1
⚡ SPEED MODE: Complete route in 30 SECONDS!
🏥 Starting from MEDICAL BUILDING

⚡ Step 1/15 [0s elapsed, 28s remaining]
📍 🏥 Medical Building START
   ✅ Updated order #abc12345

⚡ Step 5/15 [8s elapsed, 20s remaining]
📍 ☕ AT CAFÉ - PICKUP!
   💡 Click "Mark as Picked Up" NOW!

⚡ Step 15/15 [28s elapsed, 0s remaining]
📍 🎯 ARRIVED NEW ASIA!
   💡 Click "Mark as Delivered" NOW!

🛑 Stopping simulation
```

### If Resuming from Picked Up State
```
📦 Starting from CAFÉ (picked up)

⚡ Step 1/15 [0s elapsed, 28s remaining]
📍 📦 PICKED UP - GO!
   ✅ Updated order #abc12345
```

---

## Visual Elements

### Testing Mode Banners

**Delivery Partner Page:**
```
┌──────────────────────────────────────────────┐
│ ⚡ ULTRA FAST Testing Mode Active            │
│ Route completes in 30 seconds • Updates      │
│ every 2 seconds                               │
│ Watch the console for step-by-step           │
│ progress! 🚀                                  │
└──────────────────────────────────────────────┘
```

**Customer Page:**
```
┌──────────────────────────────────────────────┐
│ ⚡ ULTRA FAST Testing Mode                   │
│ Route completes in 30 seconds • Map          │
│ refreshes every 1 second                      │
│ Watch the blue marker zoom across campus! 🚀 │
└──────────────────────────────────────────────┘
```

---

## Troubleshooting

### Issue: No console output
**Solution:** Make sure you're looking at the delivery partner browser's console (F12)

### Issue: Marker not moving on customer map
**Solution:** 
- Check that delivery partner is online
- Check order status is "accepted" or "picked_up"
- Refresh customer page

### Issue: Updates seem slow
**Solution:** Clear browser cache and reload both windows

### Issue: Order stuck at a location
**Solution:** Check if you need to click "Mark as Picked Up" or "Mark as Delivered"

---

## Route Map

```
🏥 Medical Building (22.41952, 114.20545)
    |
    | 🚶💨 Fast walking (4 steps, 8 seconds)
    |
    ↓
☕ CUHK Café (22.418461, 114.204712)
    |
    | 👉 CLICK "Mark as Picked Up"
    |
    | 📦 Speed walking (10 steps, 20 seconds)
    |
    ↓
🏢 New Asia College (22.421197, 114.209186)
    |
    | 👉 CLICK "Mark as Delivered"
    |
    ✅ COMPLETE!
```

---

## Configuration Options

### Toggle Testing Mode

In `app/delivery/page.tsx`, line ~118:
```typescript
const TESTING_MODE = true  // Set to false for real GPS
```

In `app/order/[id]/page.tsx`, line ~56:
```typescript
const TESTING_MODE = true  // Set to false for production
```

### Adjust Speed

**Make it even faster (15 seconds):**
```typescript
// Update interval from 2000 to 1000
const updateInterval = setInterval(async () => {
  // ... location update code
}, 1000) // 1 second per step = 15 seconds total
```

**Slow it down (60 seconds):**
```typescript
// Update interval from 2000 to 4000
const updateInterval = setInterval(async () => {
  // ... location update code
}, 4000) // 4 seconds per step = 60 seconds total
```

---

## Production Deployment

### Switching to Real GPS Mode

When deploying to production:

1. Set `TESTING_MODE = false` in both files
2. Real GPS will activate automatically
3. Location updates based on actual device position

### Recommended Settings for Production
```typescript
// Delivery partner page
const TESTING_MODE = false
// Uses real GPS with watchPosition

// Customer page  
const TESTING_MODE = false
const refreshInterval = 10000 // 10 seconds
```

---

## Performance Metrics

### Testing Mode Performance
- **Route completion:** 30 seconds
- **Location updates:** 15 total (every 2s)
- **Customer refreshes:** 30 total (every 1s)
- **Database writes:** 15 per delivery
- **Total test time:** ~30 seconds

### Production Mode Performance
- **Location updates:** Every 5 seconds
- **Customer refreshes:** Every 10 seconds
- **Battery impact:** Optimized with HTML5 Geolocation
- **Network usage:** Minimal

---

## Success Criteria

✅ **Successful Test Checklist:**
- [ ] Delivery partner sees green testing banner
- [ ] Console logs show step-by-step progress
- [ ] Customer sees green testing banner
- [ ] Map updates every 1 second
- [ ] Blue marker moves every 2 seconds
- [ ] "Mark as Picked Up" clicked at café (8s)
- [ ] "Mark as Delivered" clicked at New Asia (28s)
- [ ] Total time: ~30 seconds
- [ ] No errors in console

---

## Next Steps

1. **Test the flow** with these updated files
2. **Verify timing** matches the 30-second timeline
3. **Check console logs** for proper step progression
4. **Watch customer map** for smooth updates
5. **Celebrate** your ultra-fast testing! 🎉

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify both files are updated correctly
3. Clear browser cache
4. Try in incognito mode
5. Check database connection

Happy testing! ⚡🚀


=============================================================================================

# Ultra Fast Testing - Quick Reference ⚡

## 🎯 Quick Stats
- **Total Time:** 30 seconds
- **Updates:** Every 2 seconds (15 total)
- **Map Refresh:** Every 1 second
- **Speed:** 10x faster than before!

---

## 📋 2-Window Setup

### Window 1: Delivery Partner
```
1. Incognito mode
2. /auth → login
3. /delivery
4. Toggle "Go Online"
5. Accept order when it appears
```

### Window 2: Customer
```
1. Regular browser
2. / (home page)
3. Place order to New Asia College
4. Click on order to track
```

---

## ⏱️ 30-Second Timeline

| Time | Event | Action |
|------|-------|--------|
| 00:00 | 🏥 Medical Building | Accept order |
| 00:08 | ☕ At Café | 👉 Click "Mark as Picked Up" |
| 00:28 | 🎯 At New Asia | 👉 Click "Mark as Delivered" |
| 00:30 | ✅ Complete! | Done! |

---

## 🖥️ Console Output

### What You'll See
```
🧪 TESTING MODE ENABLED
⚡ SPEED MODE: 30 SECONDS!
📍 Updates every 2 seconds

⚡ Step 1/15 [0s elapsed]
📍 🏥 Medical Building START

⚡ Step 5/15 [8s elapsed]
📍 ☕ AT CAFÉ
💡 Click "Mark as Picked Up" NOW!

⚡ Step 15/15 [28s elapsed]
📍 🎯 ARRIVED NEW ASIA
💡 Click "Mark as Delivered" NOW!
```

---

## 🗺️ Route Overview

```
Medical Building (Start)
    ↓ 8 seconds
CUHK Café (Pickup) ← Click "Mark as Picked Up"
    ↓ 20 seconds
New Asia College (Delivery) ← Click "Mark as Delivered"
    ✅ Done!
```

---

## 🎨 Visual Indicators

### Delivery Partner Screen
```
┌─────────────────────────────────┐
│ ⚡ ULTRA FAST Testing Mode      │
│ 30s route • 2s updates          │
└─────────────────────────────────┘
```

### Customer Screen
```
┌─────────────────────────────────┐
│ ⚡ ULTRA FAST Testing Mode      │
│ 30s route • 1s map refresh      │
│ Watch the blue marker zoom! 🚀  │
└─────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Both banners show testing mode
- [ ] Console shows step-by-step logs
- [ ] Map updates every 1 second
- [ ] Marker moves every 2 seconds
- [ ] Clicked "Picked Up" at 8s
- [ ] Clicked "Delivered" at 28s
- [ ] Total time: ~30 seconds

---

## 🔧 Toggle Testing Mode

### Turn ON (Fast Testing)
```typescript
const TESTING_MODE = true  // 30-second route
```

### Turn OFF (Production)
```typescript
const TESTING_MODE = false  // Real GPS
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| No console logs | Open DevTools (F12) |
| Map not updating | Refresh customer page |
| Marker not moving | Check order status |
| Too fast/slow | Adjust interval (2000ms) |

---

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy
git push

# View logs
# Open browser console (F12)
```

---

## 🎯 Expected Results

✅ **Delivery Partner:**
- Sees order immediately
- Accepts in 1 click
- Console shows 15 steps
- Completes in 30 seconds

✅ **Customer:**
- Sees live map
- Updates every 1 second
- Smooth marker movement
- Real-time status changes

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Total steps | 15 |
| Update frequency | 2s |
| Refresh rate | 1s |
| Database writes | 15 |
| Total duration | 30s |

---

## 🎉 That's It!

**Start testing in 30 seconds!** ⚡

1. Open 2 windows
2. Accept order
3. Click at 8s and 28s
4. Done!

**Questions?** Check TESTING_GUIDE.md for full details.