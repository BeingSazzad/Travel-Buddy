import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { SavedProvider } from '@/lib/SavedContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Trips from '@/pages/Trips';
import Friends from '@/pages/Friends';
import Events from '@/pages/Events';
import Profile from '@/pages/Profile';
import Category from '@/pages/Category';
import Welcome from '@/pages/Welcome';
import Onboarding from '@/pages/Onboarding';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Subscription from '@/pages/Subscription';
import AccountPending from '@/pages/AccountPending';
import ProfileSetup from '@/pages/ProfileSetup';
import Search from '@/pages/Search';
import CreateTrip from '@/pages/CreateTrip';
import CreateEvent from '@/pages/CreateEvent';
import EventDetail from '@/pages/EventDetail';
import Destinations from '@/pages/Destinations';
import DestinationDetail from '@/pages/DestinationDetail';
import Cafes from '@/pages/Cafes';
import CafeDetail from '@/pages/CafeDetail';
import Restaurants from '@/pages/Restaurants';
import RestaurantDetail from '@/pages/RestaurantDetail';
import Hotels from '@/pages/Hotels';
import HotelDetail from '@/pages/HotelDetail';
import Discover from '@/pages/Discover';
import Conversation from '@/pages/Conversation';
import Messages from '@/pages/Messages';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, user, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // User authenticated in the platform but not registered in this app
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Not authenticated: show the welcome + onboarding flow, then login/register
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    );
  }

  // Access control: only verified, terms-accepted, active-subscription users may use the app
  const GRANTED_SUBSCRIPTIONS = ['active', 'cancelled_active'];
  const isAdmin = user?.role === 'admin';
  const accountVerified = !!user?.is_email_verified;
  const termsAccepted = !!user?.accepted_terms_at;
  const subscriptionOk = GRANTED_SUBSCRIPTIONS.includes(user?.subscription_status);

  // Step 1: account must be verified and terms accepted
  if (!isAdmin && (!accountVerified || !termsAccepted)) {
    return (
      <Routes>
        <Route path="/account-pending" element={<AccountPending />} />
        <Route path="*" element={<Navigate to="/account-pending" replace />} />
      </Routes>
    );
  }

  // Step 2: subscription must be active (or cancelled but still within the billing period)
  if (!isAdmin && !subscriptionOk) {
    return (
      <Routes>
        <Route path="/subscription" element={<Subscription />} />
        <Route path="*" element={<Navigate to="/subscription" replace />} />
      </Routes>
    );
  }

  // Step 3: profile must be completed before using the app
  if (!isAdmin && !user?.profile_completed) {
    return (
      <Routes>
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="*" element={<Navigate to="/profile-setup" replace />} />
      </Routes>
    );
  }

  // Authenticated: render the main app
  return (
    <Routes>
      <Route path="/trips/new" element={<CreateTrip />} />
      <Route path="/events/new" element={<CreateEvent />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/conversations/:id" element={<Conversation />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cafes" element={<Cafes />} />
        <Route path="/cafes/:name" element={<CafeDetail />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:name" element={<RestaurantDetail />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:name" element={<HotelDetail />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:city" element={<DestinationDetail />} />
        <Route path="/reviews" element={<Category category="Reviews" />} />
        <Route path="/deals" element={<Category category="Deals" />} />
      </Route>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/account-pending" element={<AccountPending />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <SavedProvider>
            <AuthenticatedApp />
          </SavedProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App