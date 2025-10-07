import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthInitializer } from "./components/AuthInitializer";
import AppRoutes from "./components/AppRoutes";

export default function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <AppRoutes />
      </AuthInitializer>
    </Provider>
  );
}
