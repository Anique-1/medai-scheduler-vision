
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  medical_history: string[];
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
