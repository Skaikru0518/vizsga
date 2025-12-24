import { User } from "./auth.interface";

// User's mark on a book
export interface UserBookMark {
	bought: boolean;
	read: boolean;
	onBookshelf: boolean;
}

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
	user: User;
	user_mark: UserBookMark | null; // null if user is not authenticated or hasn't marked this book
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
}

export type UpdateBookDto = Partial<CreateBookDto>;

// Book Mark DTOs
export interface BookMarkDto {
	bought?: boolean;
	read?: boolean;
	onBookshelf?: boolean;
}
