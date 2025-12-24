import {
	Book,
	BookMarkDto,
	CreateBookDto,
	LoginDto,
	LoginResponse,
	RegisterDto,
	RegisterResponse,
	UpdateBookDto,
	User,
	UserBookMark,
} from "@/interface";
import api from "./api";

// Admin interface for creating book with user ID
interface AdminCreateBookDto extends CreateBookDto {
	user: number;
}

// Register
export const authApi = {
	// register
	register: (data: RegisterDto) =>
		api.post<RegisterResponse>("/register/", data),

	// login
	login: (data: LoginDto) => api.post<LoginResponse>("/login/", data),
};

export const bookApi = {
	// create book
	create: (data: CreateBookDto) => api.post<Book>("/books/", data),

	// get books
	getAll: () => api.get<Book[]>("/books/"),
	getById: (id: string) => api.get<Book>(`/books/${id}/`),

	// update book
	update: (id: string, data: UpdateBookDto) =>
		api.patch<Book>(`/books/${id}/`, data),

	// delete
	delete: (id: string) => api.delete(`/books/${id}/`),

	// mark/unmark books (requires authentication)
	mark: {
		// Create or update mark
		set: (bookId: number, data: BookMarkDto) =>
			api.post<UserBookMark>(`/books/${bookId}/mark/`, data),

		// Update existing mark
		update: (bookId: number, data: BookMarkDto) =>
			api.patch<UserBookMark>(`/books/${bookId}/mark/`, data),

		// Remove mark
		remove: (bookId: number) => api.delete(`/books/${bookId}/mark/`),
	},
};

export const adminApi = {
	// Users management
	users: {
		getAll: () => api.get<User[]>("/admin/users/"),
		update: (userId: number, data: Partial<User>) =>
			api.patch<User>(`/admin/users/${userId}/`, data),
		delete: (userId: number) => api.delete(`/admin/users/${userId}/`),
	},

	// Books management
	books: {
		getAll: () => api.get<Book[]>("/admin/books/"),
		create: (data: AdminCreateBookDto) => api.post<Book>("/admin/books/", data),
		update: (bookId: number, data: UpdateBookDto) =>
			api.patch<Book>(`/admin/books/${bookId}/`, data),
		delete: (bookId: number) => api.delete(`/admin/books/${bookId}/`),
	},
};
