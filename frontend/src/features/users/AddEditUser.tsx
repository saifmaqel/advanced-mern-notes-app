import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usersApis from "../../api/userApis";
import type {
  AddEditUser as AddEditUserType,
  GetAllUsersResponse,
} from "../../api/types";
import { USERS_LIST_QUERY_KEY, USER_QUERY_KEY } from "../constants";
import LoadingScreen from "../../components/LoadingScreen";

interface UserFormInputs {
  username: string;
  password: string;
  roles: string[];
  active: boolean;
}

const rolesOptions = [
  { value: "Employee", label: "Employee" },
  { value: "Admin", label: "Admin" },
];

export default function AddEditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: async () => (id ? usersApis.get(id) : null),
    enabled: !!id,
  });

  const { control, handleSubmit, reset } = useForm<UserFormInputs>({
    defaultValues: {
      username: "",
      password: "",
      roles: [],
      active: true,
    },
  });

  useEffect(() => {
    if (data?.user) {
      reset({
        username: data.user.username,
        roles: data.user.roles,
        active: data.user.active,
      });
    }
  }, [data?.user, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: AddEditUserType) => {
      if (id) return usersApis.update(id, formData);
      return usersApis.create(formData);
    },
    onSuccess: (response) => {
      if (!response?.httpStatusOk) return;

      const newOrUpdatedUser = response.user;

      queryClient.setQueryData(
        [USERS_LIST_QUERY_KEY],
        (oldData: GetAllUsersResponse | undefined) => {
          if (!oldData) return oldData;
          const existingUsers = oldData.users || [];
          const userIndex = existingUsers.findIndex(
            (user) => user._id === newOrUpdatedUser._id
          );
          let updatedUsers;
          if (userIndex !== -1) {
            updatedUsers = existingUsers.map((user) =>
              user._id === newOrUpdatedUser._id ? newOrUpdatedUser : user
            );
          } else {
            updatedUsers = [...existingUsers, newOrUpdatedUser];
          }
          return {
            ...oldData,
            users: updatedUsers,
          };
        }
      );

      navigate("/dash/users");
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    const { username, roles, active, password } = data;
    const user: AddEditUserType = {
      username,
      password,
      roles,
      active,
    };
    mutate(user);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        {id ? "Edit User" : "Add User"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Username"
              className="border p-2 rounded w-full"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="password"
              className="border p-2 rounded w-full"
            />
          )}
        />

        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <select
              multiple
              {...field}
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions,
                  (opt) => opt.value
                );
                field.onChange(values);
              }}
              className="border p-2 rounded w-full"
            >
              {rolesOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />

        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                className="form-checkbox"
              />
              Active
            </label>
          )}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isPending}
        >
          {isPending
            ? id
              ? "Saving…"
              : "Adding…"
            : id
            ? "Save Changes"
            : "Add User"}
        </button>
      </form>
    </div>
  );
}
