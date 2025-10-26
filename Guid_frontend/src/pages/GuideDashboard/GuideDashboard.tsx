import PageMeta from "../../components/common/PageMeta";

const GuideDashboard = () => {
  return (
    <>
      <PageMeta
        title="Guide Management Dashboard | TourHub Admin"
        description="Tourism Guide Management Dashboard - Overview of tours, bookings, and business metrics"
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Guide Management Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's an overview of your tourism business.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Key Metrics Cards */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tours</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <span className="text-2xl">🗺️</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bookings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$12,450</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visitors</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New booking for Paris City Tour</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Tour guide assigned to Mountain Hiking</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Payment received for Rome Historical Tour</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                + Add New Tour
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                📅 View Calendar
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                👥 Manage Customers
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                📊 View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Tours */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Tours</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Paris City Tour</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tomorrow, 10:00 AM</p>
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded-full">
                  8 booked
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Mountain Hiking Adventure</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dec 15, 9:00 AM</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs rounded-full">
                  12 booked
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Rome Historical Tour</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dec 18, 2:00 PM</p>
                </div>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs rounded-full">
                  Full
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Messages */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Messages</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  JD
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Can I get more details about the Paris tour?</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  SM
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Sarah Miller</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Thank you for the amazing tour experience!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  MR
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Mike Ross</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Is there a discount for group bookings?</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideDashboard;