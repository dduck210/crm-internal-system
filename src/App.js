// src/App.js
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/hooks/ProtectedRoute";
import UnauthRoute from "./components/hooks/UnauthRoute";
import AdminRoute from "./components/hooks/AdminRoute";
import Loading from "./components/Loading/Loading";
import AdminPage from "./pages/AdminPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <Loading>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 transition-colors">
        <Header />
        <main className="flex-1 pt-16 pb-15">
          <Routes>
            {/* Home */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Auth */}
            <Route
              path="/login"
              element={
                <UnauthRoute>
                  <Login />
                </UnauthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <UnauthRoute>
                  <Register />
                </UnauthRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </Loading>
  );
}

export default App;
