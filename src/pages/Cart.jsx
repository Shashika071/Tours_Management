import { FaMinus, FaPlus, FaShoppingBag, FaTrash } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaShoppingBag className="text-8xl text-gray-300 mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start exploring our amazing tours and add them to your cart!
          </p>
          <Link to="/" className="btn-primary">
            Browse Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="card p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-2">{item.location}</p>
                    <p className="text-gray-600 mb-4">{item.duration}</p>
                    <p className="text-2xl font-bold text-primary mb-4">${item.price}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded"
                        >
                          <FaMinus />
                        </button>
                        <span className="text-xl font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center space-x-2"
                      >
                        <FaTrash />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="block text-center text-primary hover:underline mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
