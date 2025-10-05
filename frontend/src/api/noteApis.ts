// import axios from "axios";
import { api } from "./axiosInstance";
import type {
  AddEditNote,
  AddEditNoteResponse,
  GetAllNotesResponse,
  GetNoteResponse,
  Note,
} from "./types";

const resourceNotes = "notes";

async function list(): Promise<GetAllNotesResponse> {
  const url = `/${resourceNotes}`;
  const fetched = await api.get(url, {
    // headers: { Authorization: `Bearer ${token}` },
  });

  return fetched.data;
}

async function get(
  id: string
  // token: string
): Promise<GetNoteResponse> {
  const url = `/${resourceNotes}/${id}`;
  const fetched = await api.get(url, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

async function create(note: AddEditNote): Promise<AddEditNoteResponse> {
  const url = `/${resourceNotes}`;
  const body = note;
  const fetched = await api.post(url, body, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

async function update(
  id: string,
  note: AddEditNote
  // token: string
): Promise<AddEditNoteResponse> {
  const url = `/${resourceNotes}/${id}`;
  const body = note;
  const fetched = await api.patch(url, body, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

async function remove(id: string): Promise<Note> {
  // token: string
  const url = `/${resourceNotes}/${id}`;
  const fetched = await api.delete(url, {
    // headers: { Authorization: `Bearer ${token}` },
  });
  return fetched.data;
}

const noteApis = {
  list,
  get,
  create,
  update,
  remove,
};

export default noteApis;
