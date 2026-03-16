export const Role = {
  ROLE_USER: 'ROLE_USER',
  ROLE_ADMIN: 'ROLE_ADMIN',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  MISSED: 'MISSED',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  message: string;
  token?: string; // Often APIs return a token here too
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

export interface Transaction {
  id: number;
  amount: number;
  transactionDate: string;
  note: string;
  category: Category;
}

export interface Budget {
  id: number;
  month: number;
  year: number;
  limitAmount: number;
}

export interface Semester {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Course {
  id: number;
  name: string;
  credits: number;
  lecturer: string;
  semester: Semester;
}

export interface Timetable {
  id: number;
  dayOfWeek: string;
  period: number;
  room: string;
  course: Course;
}

export interface TaskEvent {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  type: string;
}
