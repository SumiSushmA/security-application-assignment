import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import { AdminRoute } from "./components/routes/AdminRoute";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { PublicRoute } from "./components/routes/PublicRoute";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketContextProvider } from "./context/SocketContext";
import useUpdateUserStatus from "./hooks/useUpdateUserStatus";

// Lazy-loaded components
const Home = lazy(() => import("./core/public/homePage/Home"));
const Layout = lazy(() => import("./core/private/Layout"));
const ErrorPage = lazy(() => import("./core/public/errorPage/ErrorPage"));
const DashboardIndex = lazy(() => import("./core/private/dashboard"));
const UserIndex = lazy(() => import("./core/private/user"));
const BookListings = lazy(() => import("./core/private/bookListings")); // Keep as-is (backend route name)
const LoginPage = lazy(() => import("./core/public/auth/loginPage"));
const RegisterPage = lazy(() => import("./core/public/auth/RegisterPage"));
const ForgotPassword = lazy(() => import("./core/public/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./core/public/auth/ResetPassword"));
const ProductDetails = lazy(() =>
  import("./core/public/productDetails/PropertyDetails")
);
const UserProfile = lazy(() => import("./core/public/userProfile/UserProfile"));
const MessagePage = lazy(() => import("./core/public/messages/MessagePage"));
const CustomerProfile = lazy(() =>
  import("./core/public/customerProfile/CustomerProfile")
);
const NotificationsPage = lazy(() =>
  import("./core/public/notifications/NotificationsPage")
);
const Settings = lazy(() => import("./core/private/settings"));
const SecurityDashboard = lazy(() => import("./core/private/security"));

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useUpdateUserStatus();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <SocketContextProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes - Accessible to Everyone */}
            <Route path="/" element={<Home />} />
            <Route
              path="/properties/:bookId"
              element={<ProductDetails />}
            />
            <Route
              path="/customerprofile/:userId"
              element={<CustomerProfile />}
            />
            <Route path="/error" element={<ErrorPage />} />

            {/* Auth Routes - Only accessible if NOT authenticated */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Protected Routes - Only accessible if authenticated */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes - Only accessible if authenticated and role is admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Layout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<DashboardIndex />} />
              <Route path="users" element={<UserIndex />} />
              <Route path="propertylistings" element={<BookListings />} /> {/* Only UI route label changed */}
              <Route path="security" element={<SecurityDashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all Route for 404 Errors */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </NotificationProvider>
      </SocketContextProvider>
    </Suspense>
  );
}

export default App;
