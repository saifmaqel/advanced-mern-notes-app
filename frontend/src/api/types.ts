export interface ResponseObject {
  message: string;
  httpStatus?: number;
  httpStatusOk: boolean;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  roles: string[];
  active: boolean;
}

export interface LoginResponse extends ResponseObject {
  accessToken: string;
  expiresIn: number;
}

export interface RefreshResponse extends ResponseObject {
  accessToken: string;
  expiresIn: number;
}

export interface LogoutResponse extends ResponseObject {
  message: string;
}

export interface User {
  _id: string;
  username: string;
  roles: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllUsersResponse extends ResponseObject {
  users: User[];
}
export interface GetUserResponse extends ResponseObject {
  user: User;
}

export interface AddEditUser {
  username: string;
  password: string;
  roles: string[];
  active?: boolean;
}

export interface AddEditUserResponse extends ResponseObject {
  user: User;
}

export interface Note {
  _id: string;
  user: string;
  username: string;
  title: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllNotesResponse extends ResponseObject {
  notes: Note[];
}

export interface GetNoteResponse extends ResponseObject {
  note: Note;
}

export interface AddEditNote {
  user: string;
  title: string;
  text: string;
  completed?: boolean;
}

export interface AddEditNoteResponse extends ResponseObject {
  note: Note;
}
