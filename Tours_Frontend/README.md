# GuideBeeLK - Sri Lankan Tour Guide Platform

A modern, fully-featured tour booking website built with React.js, Vite, and Tailwind CSS for discovering Sri Lanka's hidden treasures.

## Features

### 🏠 Landing Page
- **Navbar**: Responsive navigation with cart and user authentication
- **Hero Section**: Eye-catching hero banner with call-to-action buttons
- **Top Tours**: Display of featured tour packages with images, pricing, and ratings
- **About Us**: Company information and statistics
- **Testimonials**: Customer reviews and ratings
- **Footer**: Complete footer with contact information and social links

### 🛒 Shopping Experience
- **Cart Page**: View and manage selected tours
- **Checkout Page**: Complete booking with personal and payment information
- **Profile Page**: User profile management and booking history

### 🔐 Authentication
- **Login/Signup Modal**: Beautiful popup window for user authentication
- **User Session**: Maintains user state across the application

### 🎨 Design Features
- Fully responsive design (mobile, tablet, desktop)
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Professional color scheme
- React Icons for beautiful iconography

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React.js 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library
- **Context API** - State management

## Key Features

### Cart Management
- Add tours to cart from the tours section
- Update quantities and remove items
- Calculate totals with tax
- Persistent cart state across pages

### Authentication System
- Modal-based login/signup
- Form validation
- User session management
- Protected routes for checkout and profile

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile devices
- Flexible grid layouts
- Optimized images

## Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',    // Blue
      secondary: '#8B5CF6',  // Purple
      accent: '#F59E0B',     // Orange
    },
  },
}
```

---

Built with ❤️ using React.js, Vite, and Tailwind CSS
