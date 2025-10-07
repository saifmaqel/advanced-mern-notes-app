import { jwtDecode } from "jwt-decode";
import { type RootState } from "../store/store";
import { useSelector } from "react-redux";

type Roles = "Employee" | "Manager" | "Admin";

interface CustomJwtPayload {
  UserInfo: {
    username: string;
    roles: Roles[];
  };
  exp?: number;
  iat?: number;
}

function useAuth() {
  const token = useSelector((state: RootState) => state.auth.token);

  let isManager = false;
  let isAdmin = false;
  let status: Roles = "Employee";

  if (token) {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const { username, roles } = decoded.UserInfo;

    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { username, roles, isManager, isAdmin, status };
  }

  return { username: "", roles: [], isManager, isAdmin, status };
}

export default useAuth;
