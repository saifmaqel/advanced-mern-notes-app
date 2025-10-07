import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NOTES_LIST_QUERY_KEY } from "../constants";
import notesApis from "../../api/noteApis";
import type { GetAllNotesResponse, Note } from "../../api/types";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";

function NotesList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, isManager, username } = useAuth();
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const { data, isPending, error } = useQuery({
    queryKey: [NOTES_LIST_QUERY_KEY],
    queryFn: async () => {
      const data = await notesApis.list();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const onEditClick = (note: Note) => {
    navigate(`edit/${note._id}`);
  };

  const deleteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      setDeletingNoteId(noteId);
      return notesApis.remove(noteId);
    },
    onSuccess: (response, noteId) => {
      if (!response) return;

      queryClient.setQueryData(
        [NOTES_LIST_QUERY_KEY],
        (oldData: GetAllNotesResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            notes: oldData.notes.filter((note) => note._id !== noteId),
          };
        }
      );
    },
    onSettled: () => {
      setDeletingNoteId(null);
    },
  });

  if (isPending) return <LoadingScreen />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const notes =
    isAdmin || isManager
      ? data?.notes
      : data?.notes.filter((note) => note.username === username);

  return (
    <div className="flex flex-col w-full flex-1 max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Notes List</h1>
        <button
          onClick={() => navigate("add")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Note
        </button>
      </div>

      {notes?.length === 0 && (
        <div className="mx-auto  text-lg font-bold">
          <h1>No notes available </h1>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes?.map((note) => (
          <div
            key={note._id}
            className="border rounded-lg shadow-sm bg-white p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
              <p className="text-gray-700 mb-3">{note.text}</p>
              <p className="text-sm text-gray-500">
                Completed: {note.completed ? "✅" : "❌"}
              </p>
              <p className="text-sm text-gray-500">Owner: {note.username}</p>
              <p className="text-sm text-gray-400">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                Updated: {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEditClick(note)}
                className="px-3 py-1 text-sm font-medium text-white border bg-blue-600 rounded hover:bg-blue-500 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(note._id)}
                disabled={
                  deleteMutation.isPending && deletingNoteId === note._id
                }
                className="px-3 py-1 text-sm font-medium text-white border bg-red-600 rounded hover:bg-red-500 disabled:opacity-50 cursor-pointer"
              >
                {deleteMutation.isPending && deletingNoteId === note._id
                  ? "Deleting…"
                  : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesList;
