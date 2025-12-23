// Request DTOs
export interface RegisterDto {
	username: string;
	email: string;
	password: string;
	last_name: string;
	first_name: string;
}

export interface LoginDto {
	username: string;
	password: string;
}

// Response Types
export interface User {
	id: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	is_staff: boolean;
	is_superuser: boolean;
	is_active: boolean;
	date_joined: string;
}

export interface LoginResponse {
	access: string;
	refresh: string;
	user: User;
}

export interface RegisterResponse {
	id: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
}
