import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import AddEditNote from "./features/notes/AddEditNote";
import AddEditUser from "./features/users/AddEditUser";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { AuthInitializer } from "./components/AuthInitializer";

export default function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />
              <Route path="notes">
                <Route index element={<NotesList />} />
                <Route path="add" element={<AddEditNote />} />
                <Route path="edit/:id" element={<AddEditNote />} />
              </Route>
              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path="add" element={<AddEditUser />} />
                <Route path="edit/:id" element={<AddEditUser />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthInitializer>
    </Provider>
  );
}
