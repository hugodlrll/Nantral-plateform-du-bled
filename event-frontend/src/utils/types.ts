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
    seats?: number;
  created_by?: number;
  created_by_username?: string;
  created_at?: string;
    is_registered?: boolean;
    is_owner?: boolean;
    registrants_count?: number;
        remaining_seats?: number;
        is_full?: boolean;
};

export interface EventFormProps {
    title: string;
    date: string;
    description: string;
    seats: number;
    onTitleChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onSeatsChange: (value: number) => void;
    buttonText?: string;
    onSubmit: () => void;
}
