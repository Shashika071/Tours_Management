# Quick Start Guide - Tours Management Website

## 🎉 Your Tour Booking Website is Ready!

The development server is now running at: **http://localhost:5173/**

## ✅ What's Included

### Pages:
1. **Home Page** (/) - Landing page with:
   - Hero section with stunning background
   - Featured tours section
   - About us section
   - Customer testimonials
   - Responsive navbar and footer

2. **Cart Page** (/cart) - Shopping cart with:
   - View all selected tours
   - Update quantities
   - Remove items
   - See total with tax calculation

3. **Checkout Page** (/checkout) - Complete booking:
   - Personal information form
   - Billing address
   - Payment information
   - Order summary
   - Requires login to access

4. **Profile Page** (/profile) - User account:
   - View and edit profile information
   - See booking history
   - Logout functionality
   - Requires login to access

### Features:
- ✅ Login/Signup popup modal
- ✅ Shopping cart functionality
- ✅ User authentication system
- ✅ Fully responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Smooth animations

## 🚀 How to Use

### Testing the Website:

1. **Browse Tours**
   - Scroll down on the home page to see featured tours
   - Click "Add to Cart" on any tour

2. **Login/Signup**
   - Click "Login / Sign Up" button in navbar
   - Fill in the form (demo authentication)
   - You can use any email/password for testing

3. **View Cart**
   - Click the cart icon in navbar
   - Update quantities or remove items
   - Click "Proceed to Checkout"

4. **Complete Booking**
   - Fill in checkout form
   - Click "Pay" button to complete order
   - You'll see a confirmation message

5. **View Profile**
   - Click on your avatar/name in navbar
   - Edit profile information
   - View booking history

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.jsx
│   ├── AuthModal.jsx
│   ├── Hero.jsx
│   ├── TourCard.jsx
│   ├── TopTours.jsx
│   ├── Testimonials.jsx
│   ├── About.jsx
│   └── Footer.jsx
├── pages/             # Page components
│   ├── Home.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   └── Profile.jsx
├── context/           # State management
│   ├── CartContext.jsx
│   └── AuthContext.jsx
└── index.css          # Tailwind styles
```

## 🎨 Customization

### Change Colors:
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#3B82F6',    // Change this
  secondary: '#8B5CF6',  // Change this
  accent: '#F59E0B',     // Change this
}
```

### Add More Tours:
Edit `src/components/TopTours.jsx` and add more tour objects to the `tours` array.

### Change Images:
Replace the image URLs in the components with your own images.

## 🛠 Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Next Steps

1. **Add Backend Integration**
   - Connect to a real API
   - Implement actual authentication
   - Store bookings in database

2. **Add Payment Gateway**
   - Integrate Stripe/PayPal
   - Process real payments

3. **Enhance Features**
   - Add search functionality
   - Add filters (price, location, duration)
   - Add reviews system
   - Add booking calendar

4. **Deploy**
   - Build for production: `npm run build`
   - Deploy to Vercel, Netlify, or other hosting

## 🐛 Troubleshooting

**Issue**: Dependencies not installed
**Solution**: Run `npm install`

**Issue**: Port 5173 already in use
**Solution**: Kill the process or change port in `vite.config.js`

**Issue**: Styles not loading
**Solution**: Make sure Tailwind CSS is properly installed

## 📚 Technologies Used

- React.js 19
- Vite
- Tailwind CSS
- React Router DOM
- React Icons
- Context API

## 🎯 Demo Credentials

For testing, you can use any credentials:
- Email: demo@example.com
- Password: password123

---

**Enjoy building your tour booking website! 🌍✈️**
