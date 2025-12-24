import { User } from "./auth.interface";

// Response Type
export interface Book {
	id: number;
	title: string;
	author: string;
	description: string;
	isbn: string | null;
	genre: string | null;
	cover: string | null;
	coverUrl: string | null;
	bought: boolean;
	read: boolean;
	onBookshelf: boolean;
	user: User;
}

// Request DTOs
export interface CreateBookDto {
	title: string;
	author: string;
	description: string;
	isbn?: string | null;
	genre?: string | null;
	cover?: File | null;
	coverUrl?: string | null;
	bought?: boolean;
	read?: boolean;
	onBookshelf?: boolean;
}

export type UpdateBookDto = Partial<CreateBookDto>;
