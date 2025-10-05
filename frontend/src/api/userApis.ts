// import axios from "axios";
import { api } from "./axiosInstance";
import type {
  AddEditUser,
  AddEditUserResponse,
  GetAllUsersResponse,
  GetUserResponse,
  User,
} from "./types";

const resourceUsers = "users";

async function list(): Promise<GetAllUsersResponse> {
  const url = `/${resourceUsers}`;
  const fetched = await api.get(url, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

async function get(
  id: string
  // token: string
): Promise<GetUserResponse> {
  const url = `/${resourceUsers}/${id}`;
  const fetched = await api.get(url, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

async function create(user: AddEditUser): Promise<AddEditUserResponse> {
  const url = `/${resourceUsers}`;
  const body = user;
  const fetched = await api.post(url, body, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

async function update(
  id: string,
  user: AddEditUser
  // token: string
): Promise<AddEditUserResponse> {
  const url = `/${resourceUsers}/${id}`;
  const body = user;
  const fetched = await api.patch(url, body, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

async function remove(id: string): Promise<User> {
  // token: string
  const url = `/${resourceUsers}/${id}`;
  const fetched = await api.delete(url, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

const userApis = {
  list,
  get,
  create,
  update,
  remove,
};

export default userApis;
