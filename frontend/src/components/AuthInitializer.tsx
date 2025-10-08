import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import authApis from "../api/authApis";
import { setCredentials } from "../features/auth/authSlice";
import { scheduleTokenExpiryWatcher } from "../api/axiosInstance";
import LoadingScreen from "./LoadingScreen";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApis.refresh();
        dispatch(setCredentials({ accessToken: response.accessToken }));
        scheduleTokenExpiryWatcher(response.expiresIn);
        setIsChecking(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        if (location.pathname !== "/login" && location.pathname !== "/") {
          navigate("/login", {
            replace: true,
            state: { from: location.pathname },
          });
        }
        setIsChecking(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isChecking) {
    return (
      <div className="h-screen">
        <LoadingScreen />
      </div>
    );
  }

  return <>{children}</>;
};
