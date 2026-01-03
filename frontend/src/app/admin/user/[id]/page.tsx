"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { adminApi } from "@/lib/api-routes";
import { User, Book } from "@/interface";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
	UserDetailsCard,
	UserBooksTable,
	EditBookDialog,
	DeleteUserDialog,
	DeleteBookDialog,
} from "@/components/admin";

export default function AdminUserDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const userId = parseInt(params.id as string);
	const { user: currentUser, isAuthenticated } = useUser();
	const [user, setUser] = useState<User | null>(null);
	const [userBooks, setUserBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);
	const [isEditingUser, setIsEditingUser] = useState(false);
	const [editedUser, setEditedUser] = useState<Partial<User>>({});
	const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
	const [deleteBookId, setDeleteBookId] = useState<number | null>(null);
	const [editBookDialogOpen, setEditBookDialogOpen] = useState(false);
	const [editingBook, setEditingBook] = useState<Book | null>(null);
	const [editedBookData, setEditedBookData] = useState<Partial<Book>>({});
	const [coverType, setCoverType] = useState<"url" | "file">("url");
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [coverUrl, setCoverUrl] = useState("");

	useEffect(() => {
		// Check if current user is admin
		if (
			isAuthenticated === false ||
			(currentUser && !currentUser.is_superuser)
		) {
			toast.error("Access denied. Admin privileges required.");
			router.push("/");
			return;
		}

		if (currentUser?.is_superuser) {
			fetchUserData();
		}
	}, [isAuthenticated, currentUser, router, userId]);

	const fetchUserData = async () => {
		try {
			// Fetch all users and find the specific one
			const usersResponse = await adminApi.users.getAll();
			const foundUser = usersResponse.data.find((u) => u.id === userId);

			if (!foundUser) {
				toast.error("User not found");
				router.push("/admin");
				return;
			}

			setUser(foundUser);
			setEditedUser(foundUser);

			// Fetch all books and filter by user
			const booksResponse = await adminApi.books.getAll();
			const userBooksFiltered = booksResponse.data.filter(
				(book) => book.user.id === userId
			);
			setUserBooks(userBooksFiltered);
		} catch (error) {
			console.error("Failed to fetch user data:", error);
			toast.error("Failed to load user data");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateUser = async () => {
		if (!user) return;

		try {
			const updateData = {
				username: editedUser.username,
				email: editedUser.email,
				first_name: editedUser.first_name,
				last_name: editedUser.last_name,
				is_active: editedUser.is_active,
				is_staff: editedUser.is_staff,
				is_superuser: editedUser.is_superuser,
			};

			await adminApi.users.update(user.id, updateData);
			toast.success("User updated successfully");
			setIsEditingUser(false);
			fetchUserData();
		} catch (error) {
			console.error("Failed to update user:", error);
			toast.error("Failed to update user");
		}
	};

	const handleDeleteUser = async () => {
		if (!user) return;

		try {
			await adminApi.users.delete(user.id);
			toast.success("User deleted successfully");
			router.push("/admin");
		} catch (error) {
			console.error("Failed to delete user:", error);
			toast.error("Failed to delete user");
		}
	};

	const handleDeleteBook = async (bookId: number) => {
		try {
			await adminApi.books.delete(bookId);
			toast.success("Book deleted successfully");
			setDeleteBookId(null);
			fetchUserData();
		} catch (error) {
			console.error("Failed to delete book:", error);
			toast.error("Failed to delete book");
		}
	};

	const openEditBookDialog = (book: Book) => {
		setEditingBook(book);
		setEditedBookData({
			title: book.title,
			author: book.author,
			description: book.description,
			isbn: book.isbn || "",
			genre: book.genre || "",
		});
		setCoverType("url");
		setCoverUrl(book.coverUrl || "");
		setCoverFile(null);
		setEditBookDialogOpen(true);
	};

	const handleUpdateBook = async () => {
		if (!editingBook) return;

		try {
			// Check if we're uploading a new file
			if (coverType === "file" && coverFile) {
				const formData = new FormData();
				formData.append("title", editedBookData.title || "");
				formData.append("author", editedBookData.author || "");
				formData.append("description", editedBookData.description || "");
				if (editedBookData.isbn) formData.append("isbn", editedBookData.isbn);
				if (editedBookData.genre)
					formData.append("genre", editedBookData.genre);
				formData.append("cover", coverFile);

				await adminApi.books.update(editingBook.id, formData as any);
			} else {
				// Update with URL or no cover change
				const updateData: any = {
					title: editedBookData.title,
					author: editedBookData.author,
					description: editedBookData.description,
					isbn: editedBookData.isbn,
					genre: editedBookData.genre,
				};

				if (coverType === "url") {
					updateData.coverUrl = coverUrl;
				}

				await adminApi.books.update(editingBook.id, updateData);
			}

			toast.success("Book updated successfully");
			setEditBookDialogOpen(false);
			setEditingBook(null);
			fetchUserData();
		} catch (error) {
			console.error("Failed to update book:", error);
			toast.error("Failed to update book");
		}
	};

	const cancelEditingUser = () => {
		setIsEditingUser(false);
		setEditedUser(user || {});
	};

	if (loading || !currentUser) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
					<p className="text-stone-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!currentUser.is_superuser || !user) {
		return null;
	}

	return (
		<div className="min-h-screen page-bg">
			{/* Hero Section */}
			<div className="hero-bg">
				<div className="container mx-auto">
					<div className="flex items-center gap-3">
						<Shield className="w-8 h-8 text-amber-600" />
						<h1 className="text-4xl font-bold text-stone-800">
							User Management
						</h1>
					</div>
					<p className="text-stone-600 mt-2">
						Manage user details and their uploaded books
					</p>
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 hover:cursor-pointer mt-2"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8 space-y-8">
				<UserDetailsCard
					user={user}
					isEditing={isEditingUser}
					editedUser={editedUser}
					onEdit={() => setIsEditingUser(true)}
					onSave={handleUpdateUser}
					onCancel={cancelEditingUser}
					onDelete={() => setDeleteUserDialogOpen(true)}
					onUserChange={(updates) =>
						setEditedUser({ ...editedUser, ...updates })
					}
				/>

				<UserBooksTable
					books={userBooks}
					onEdit={openEditBookDialog}
					onDelete={(bookId) => setDeleteBookId(bookId)}
				/>
			</div>

			<EditBookDialog
				open={editBookDialogOpen}
				onOpenChange={setEditBookDialogOpen}
				bookData={editedBookData}
				onBookDataChange={(updates) =>
					setEditedBookData({ ...editedBookData, ...updates })
				}
				coverType={coverType}
				onCoverTypeChange={setCoverType}
				coverUrl={coverUrl}
				onCoverUrlChange={setCoverUrl}
				onCoverFileChange={setCoverFile}
				onSave={handleUpdateBook}
			/>

			<DeleteUserDialog
				open={deleteUserDialogOpen}
				onOpenChange={setDeleteUserDialogOpen}
				username={user?.username || ""}
				onConfirm={handleDeleteUser}
			/>

			<DeleteBookDialog
				open={deleteBookId !== null}
				onOpenChange={(open) => !open && setDeleteBookId(null)}
				onConfirm={() => deleteBookId && handleDeleteBook(deleteBookId)}
			/>
		</div>
	);
}
