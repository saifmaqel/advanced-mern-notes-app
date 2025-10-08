import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Welcome from "../features/auth/Welcome";
import AddEditNote from "../features/notes/AddEditNote";
import NotesList from "../features/notes/NotesList";
import AddEditUser from "../features/users/AddEditUser";
import UsersList from "../features/users/UsersList";
import useAuth from "../hooks/useAuth";
import DashLayout from "./DashLayout";
import LandingPage from "./LandingPage";
import Layout from "./Layout";
import LoadingScreen from "./LoadingScreen";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "../features/auth/Signup";

export default function AppRoutes() {
  const { isManager, isAdmin } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="h-screen">
          <LoadingScreen />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} />
            <Route path="notes">
              <Route index element={<NotesList />} />
              <Route path="add" element={<AddEditNote />} />
              <Route path="edit/:id" element={<AddEditNote />} />
            </Route>

            <Route
              path="users/*"
              element={
                <ProtectedRoute isAllowed={isManager || isAdmin}>
                  <Routes>
                    <Route index element={<UsersList />} />
                    <Route path="add" element={<AddEditUser />} />
                    <Route path="edit/:id" element={<AddEditUser />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
