import { Route, BrowserRouter as Router, Routes } from "react-router";

import Alerts from "./pages/UiElements/Alerts";
import AllGuides from "./pages/AllGuides";
import AppLayout from "./layout/AppLayout";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import Buttons from "./pages/UiElements/Buttons";
import Calendar from "./pages/Calendar";
import DeletionRequests from "./pages/DeletionRequests";
import FormElements from "./pages/Forms/FormElements";
import GuideProfileReview from "./pages/GuideProfileReview";
import Guides from "./pages/Guides";
import Home from "./pages/Dashboard/Home";
import Images from "./pages/UiElements/Images";
import LineChart from "./pages/Charts/LineChart";
import NotFound from "./pages/OtherPage/NotFound";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Tours from "./pages/Tours";
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
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/all-guides" element={<AllGuides />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/guide-profile-review" element={<GuideProfileReview />} />
            <Route path="/deletion-requests" element={<DeletionRequests />} />
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

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
