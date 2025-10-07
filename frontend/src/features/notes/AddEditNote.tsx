import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notesApis from "../../api/noteApis";
import type { AddEditNote, GetAllNotesResponse } from "../../api/types";
import { NOTE_QUERY_KEY, NOTES_LIST_QUERY_KEY } from "../constants";
import LoadingScreen from "../../components/LoadingScreen";

interface NoteFormInputs {
  title: string;
  text: string;
  completed: boolean;
}

export default function AddEditNote() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [NOTE_QUERY_KEY, id],
    queryFn: async () => (id ? notesApis.get(id) : null),
    enabled: !!id,
  });

  const { control, handleSubmit, reset } = useForm<NoteFormInputs>({
    defaultValues: {
      title: "",
      text: "",
      completed: false,
    },
  });

  useEffect(() => {
    if (data?.note) {
      reset({
        title: data.note.title,
        text: data.note.text,
        completed: data.note.completed,
      });
    }
  }, [data?.note, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddEditNote) => {
      if (id) {
        return notesApis.update(id, data);
      } else {
        return notesApis.create(data);
      }
    },
    onSuccess: (response) => {
      if (!response.httpStatusOk) return;

      const updatedNote = response.note;

      queryClient.setQueryData(
        [NOTES_LIST_QUERY_KEY],
        (oldData: GetAllNotesResponse | undefined) => {
          if (!oldData) return oldData;

          const existingNotes = oldData.notes || [];

          const noteIndex = existingNotes.findIndex(
            (note) => note._id === updatedNote._id
          );

          let newNotes;
          if (noteIndex !== -1) {
            newNotes = [...existingNotes];
            newNotes[noteIndex] = updatedNote;
          } else {
            console.log(updatedNote);

            newNotes = [...existingNotes, updatedNote];
          }

          return {
            ...oldData,
            notes: newNotes,
          };
        }
      );

      navigate("/dash/notes");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (data: NoteFormInputs) => {
    const { text, completed, title } = data;
    const note: AddEditNote = {
      text,
      title,
      user: "68c01ded11337dec98d73199",
      completed,
    };

    mutate(note);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        {id ? "Edit Note" : "Add Note"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Title"
              className="border p-2 rounded w-full"
            />
          )}
        />

        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              placeholder="Text"
              className="border p-2 rounded w-full"
              rows={4}
            />
          )}
        />

        <Controller
          name="completed"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2">
              <input
                // {...field.}
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                ref={field.ref}
                name={field.name}
                disabled={field.disabled}
                onBlur={field.onBlur}
              />
              Completed
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
            : "Add Note"}
        </button>
      </form>
    </div>
  );
}
