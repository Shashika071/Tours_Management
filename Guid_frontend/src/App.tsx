import { Route, BrowserRouter as Router, Routes } from "react-router";

import Alerts from "./pages/UiElements/Alerts";
import AppLayout from "./layout/AppLayout";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import Buttons from "./pages/UiElements/Buttons";
import Calendar from "./pages/Calendar";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import FormElements from "./pages/Forms/FormElements";
import GeneralSettings from "./pages/Settings/GeneralSettings";
import GuideDashboard from "./pages/GuideDashboard/GuideDashboard";
import Images from "./pages/UiElements/Images";
import LineChart from "./pages/Charts/LineChart";
import NotFound from "./pages/OtherPage/NotFound";
import PaymentSettings from "./pages/Settings/PaymentSettings";
import PlaceholderPage from "./components/common/PlaceholderPage";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<GuideDashboard />} />

            {/* Tours Management */}
            <Route path="/tours/add" element={<PlaceholderPage title="Add Tour" description="Create a new tour listing with details, pricing, and schedule." />} />
            <Route path="/tours/manage" element={<PlaceholderPage title="All Tours" description="Manage and edit all your tour listings." />} />
            <Route path="/tours/categories" element={<PlaceholderPage title="Tour Categories" description="Organize tours by categories and types." />} />
            <Route path="/tours/locations" element={<PlaceholderPage title="Tour Locations" description="Manage tour destinations and locations." />} />
            <Route path="/tours/calendar" element={<PlaceholderPage title="Tour Calendar" description="Visual calendar showing all scheduled tours." />} />

            {/* Bookings */}
            <Route path="/bookings/all" element={<PlaceholderPage title="All Bookings" description="View and manage all customer bookings." />} />
            <Route path="/bookings/pending" element={<PlaceholderPage title="Pending Bookings" description="Review and confirm pending booking requests." />} />
            <Route path="/bookings/completed" element={<PlaceholderPage title="Completed Tours" description="Track past completed tours and customer feedback." />} />
            <Route path="/bookings/refunds" element={<PlaceholderPage title="Refunds" description="Manage refund requests and cancellations." />} />

            {/* Customers */}
            <Route path="/customers/list" element={<PlaceholderPage title="Customer List" description="View all registered customers and their booking history." />} />
            <Route path="/customers/reviews" element={<PlaceholderPage title="Customer Reviews" description="Manage and approve customer reviews and testimonials." />} />
            <Route path="/customers/inquiries" element={<PlaceholderPage title="Inquiries" description="Handle customer inquiries and contact form submissions." />} />

            {/* Gallery / Media */}
            <Route path="/gallery/add" element={<PlaceholderPage title="Add Media" description="Upload tour photos and promotional videos." />} />
            <Route path="/gallery/manage" element={<PlaceholderPage title="Manage Gallery" description="Organize and manage your media library." />} />

            {/* Blog / Articles */}
            <Route path="/blog/add" element={<PlaceholderPage title="Add Blog Post" description="Create new travel blog posts and articles." />} />
            <Route path="/blog/manage" element={<PlaceholderPage title="Manage Posts" description="Edit and manage all blog posts." />} />
            <Route path="/blog/categories" element={<PlaceholderPage title="Blog Categories" description="Organize blog posts by categories and tags." />} />

            {/* Offers & Promotions */}
            <Route path="/offers/add" element={<PlaceholderPage title="Add Offer" description="Create special discounts and promotional packages." />} />
            <Route path="/offers/manage" element={<PlaceholderPage title="Manage Offers" description="Edit and remove expired offers." />} />

            {/* Destinations */}
            <Route path="/destinations/add" element={<PlaceholderPage title="Add Destination" description="Add new tour destinations and locations." />} />
            <Route path="/destinations/manage" element={<PlaceholderPage title="Manage Destinations" description="Edit destination details and highlight featured locations." />} />

            {/* Tour Guides */}
            <Route path="/guides/add" element={<PlaceholderPage title="Add Guide" description="Add new tour guide profiles and information." />} />
            <Route path="/guides/manage" element={<PlaceholderPage title="Manage Guides" description="Edit guide details and assign tours to guides." />} />

            {/* Settings */}
            <Route path="/settings/general" element={<GeneralSettings />} />
            <Route path="/settings/payment" element={<PaymentSettings />} />

            {/* Messages / Support */}
            <Route path="/messages/inbox" element={<PlaceholderPage title="Inbox" description="View messages from customers and inquiries." />} />
            <Route path="/messages/support" element={<PlaceholderPage title="Support Tickets" description="Manage customer support tickets and issues." />} />

            {/* Reports / Analytics */}
            <Route path="/reports/tours" element={<PlaceholderPage title="Tour Reports" description="View analytics on popular tours and booking statistics." />} />
            <Route path="/reports/revenue" element={<PlaceholderPage title="Revenue Reports" description="Track income and financial performance over time." />} />
            <Route path="/reports/customers" element={<PlaceholderPage title="Customer Stats" description="Analyze customer data, repeat visitors, and demographics." />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
