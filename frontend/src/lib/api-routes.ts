import {
	LoginDto,
	LoginResponse,
	RegisterDto,
	RegisterResponse,
} from "@/interface";
import api from "./api";

// Register
export const authApi = {
	// register
	register: (data: RegisterDto) =>
		api.post<RegisterResponse>("/register", data),

	// login
	login: (data: LoginDto) => api.post<LoginResponse>("/login", data),
};
