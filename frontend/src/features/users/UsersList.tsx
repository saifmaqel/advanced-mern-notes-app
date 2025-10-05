import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeAlpine,
} from "ag-grid-community";
import { useNavigate } from "react-router-dom";
import usersApis from "../../api/userApis"; // must have list(), delete() implemented
import type { User } from "../../api/types";
import { USERS_LIST_QUERY_KEY } from "../constants";

ModuleRegistry.registerModules([AllCommunityModule]);

function UsersList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: [USERS_LIST_QUERY_KEY],
    queryFn: async () => {
      const data = await usersApis.list();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const onEditClick = useCallback(
    (user: User) => {
      navigate(`edit/${user._id}`);
    },
    [navigate]
  );

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      return usersApis.remove(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_LIST_QUERY_KEY] });
    },
  });

  const columnDefs = useMemo<ColDef<User>[]>(
    () => [
      {
        width: 180,
        filter: false,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<User>) => (
          <div className="flex gap-2">
            <button
              onClick={() => onEditClick(params.data!)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-500 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => deleteMutation.mutate(params.data!._id)}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 border border-red-600 rounded hover:bg-red-500 cursor-pointer"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        ),
      },
      { headerName: "Username", field: "username", flex: 1 },
      {
        headerName: "Roles",
        field: "roles",
        flex: 1,
        valueFormatter: (p) =>
          Array.isArray(p.value) ? p.value.join(", ") : p.value,
      },
      {
        headerName: "Active",
        field: "active",
        width: 120,
        cellRenderer: (p: ICellRendererParams<User>) => (p.value ? "✅" : "❌"),
      },
    ],
    [deleteMutation, onEditClick]
  );

  if (isPending) return <p>Loading…</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const rowData = data?.users ?? [];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Users List</h1>
        <button
          onClick={() => navigate("add")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create User
        </button>
      </div>

      <div className="h-full w-full">
        <AgGridReact<User>
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          theme={themeAlpine}
        />
      </div>
    </div>
  );
}

export default UsersList;
