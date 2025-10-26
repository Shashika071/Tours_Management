import { FaShoppingBag } from 'react-icons/fa';
import React from 'react';

const Orders = () => {
  // Mock orders data - replace with actual data from API
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-10-20',
      status: 'Completed',
      items: [
        {
          id: 1,
          name: 'Paris Adventure Tour',
          image: '/api/placeholder/300/200',
          price: 1200,
          quantity: 2,
        },
        {
          id: 2,
          name: 'Rome Historical Tour',
          image: '/api/placeholder/300/200',
          price: 800,
          quantity: 1,
        },
      ],
      total: 3200,
    },
    {
      id: 'ORD-002',
      date: '2025-10-15',
      status: 'Processing',
      items: [
        {
          id: 3,
          name: 'Tokyo City Tour',
          image: '/api/placeholder/300/200',
          price: 1500,
          quantity: 1,
        },
      ],
      total: 1500,
    },
  ];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaShoppingBag className="text-8xl text-gray-300 mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start booking amazing tours and your orders will appear here!
          </p>
          <a href="/" className="btn-primary">
            Browse Tours
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Orders</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                    <p className="text-gray-600">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-primary font-bold">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-primary">${order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Statistics</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Orders</span>
                  <span className="font-semibold">{orders.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Completed Orders</span>
                  <span className="font-semibold">{orders.filter(o => o.status === 'Completed').length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Spent</span>
                  <span className="font-semibold">${orders.reduce((sum, o) => sum + o.total, 0)}</span>
                </div>
              </div>

              <a href="/" className="btn-primary w-full text-center block">
                Book More Tours
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
