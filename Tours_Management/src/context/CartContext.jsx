import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (tour) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === tour.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === tour.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...tour, quantity: 1 }];
    });
  };

  const removeFromCart = (tourId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== tourId));
  };

  const updateQuantity = (tourId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(tourId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === tourId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
