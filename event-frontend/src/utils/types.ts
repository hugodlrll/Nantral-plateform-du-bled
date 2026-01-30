export interface LoginResponse {
    token: string;
}

export interface User {
    id: string;
    username: string;
    email?: string;
}

export interface AppRouteProps { 
    user : User | null
    token : string | null
    onLoginSuccess: (token: string, user: User) => void
    onLogout: () => void
}

export type Event = {
  id: number;
  title: string;
  date: string;
  description: string;
  created_by?: number;
  created_by_username?: string;
  created_at?: string;
    is_registered?: boolean;
    is_owner?: boolean;
    registrants_count?: number;
};

export interface EventFormProps {
    title: string;
    date: string;
    description: string;
    onTitleChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    buttonText?: string;
    onSubmit: () => void;
}
