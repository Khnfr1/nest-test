import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import UploadAvatar from "./components/UploadAvatar";
// import UploadListingImages from "./components/UploadListingImages
import CreateListingButton from "./components/CreateListingButton";
import { AuthProvider, useAuth } from "./context/AuthContext";
// import CreateListingButton from "./components/CreateListingButton";

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <Routes>
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />
      <Route path="/upload-avatar" element={<UploadAvatar />} />
      <Route path="/upload-listing-images" element={<CreateListingButton />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
