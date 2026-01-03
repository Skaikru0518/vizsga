"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { adminApi } from "@/lib/api-routes";
import { User, Book } from "@/interface";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Shield,
	UserCircle,
	Calendar,
	BookOpen,
	ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getBookCoverUrl } from "@/lib/utils/book-cover";
import { Button } from "@/components/ui/button";

const USERS_PER_PAGE = 10;
const BOOKS_PER_PAGE = 10;

export default function AdminPage() {
	const router = useRouter();
	const { user, isAuthenticated } = useUser();
	const [users, setUsers] = useState<User[]>([]);
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(true);
	const [usersPage, setUsersPage] = useState(1);
	const [booksPage, setBooksPage] = useState(1);

	useEffect(() => {
		// Check if user is admin
		if (isAuthenticated === false || (user && !user.is_superuser)) {
			toast.error("Access denied. Admin privileges required.");
			router.push("/");
			return;
		}

		if (user?.is_superuser) {
			fetchData();
		}
	}, [isAuthenticated, user, router]);

	const fetchData = async () => {
		try {
			const [usersResponse, booksResponse] = await Promise.all([
				adminApi.users.getAll(),
				adminApi.books.getAll(),
			]);
			setUsers(usersResponse.data);
			setBooks(booksResponse.data);
		} catch (error) {
			console.error("Failed to fetch data:", error);
			toast.error("Failed to load data");
		} finally {
			setLoading(false);
		}
	};

	// Users pagination
	const usersTotalPages = Math.ceil(users.length / USERS_PER_PAGE);
	const paginatedUsers = useMemo(() => {
		const startIndex = (usersPage - 1) * USERS_PER_PAGE;
		const endIndex = startIndex + USERS_PER_PAGE;
		return users.slice(startIndex, endIndex);
	}, [users, usersPage]);

	const getUsersPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const showEllipsis = usersTotalPages > 7;

		if (!showEllipsis) {
			for (let i = 1; i <= usersTotalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (usersPage > 3) {
				pages.push("ellipsis");
			}

			const start = Math.max(2, usersPage - 1);
			const end = Math.min(usersTotalPages - 1, usersPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (usersPage < usersTotalPages - 2) {
				pages.push("ellipsis");
			}

			pages.push(usersTotalPages);
		}

		return pages;
	};

	// Books pagination
	const booksTotalPages = Math.ceil(books.length / BOOKS_PER_PAGE);
	const paginatedBooks = useMemo(() => {
		const startIndex = (booksPage - 1) * BOOKS_PER_PAGE;
		const endIndex = startIndex + BOOKS_PER_PAGE;
		return books.slice(startIndex, endIndex);
	}, [books, booksPage]);

	const getBooksPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const showEllipsis = booksTotalPages > 7;

		if (!showEllipsis) {
			for (let i = 1; i <= booksTotalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (booksPage > 3) {
				pages.push("ellipsis");
			}

			const start = Math.max(2, booksPage - 1);
			const end = Math.min(booksTotalPages - 1, booksPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (booksPage < booksTotalPages - 2) {
				pages.push("ellipsis");
			}

			pages.push(booksTotalPages);
		}

		return pages;
	};

	if (loading || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
					<p className="text-stone-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!user.is_superuser) {
		return null;
	}

	return (
		<div className="min-h-screen page-bg">
			{/* Hero Section */}
			<div className="hero-bg">
				<div className="container mx-auto">
					<div className="flex items-center gap-3">
						<Shield className="w-8 h-8 text-amber-600" />
						<h1 className="text-4xl font-bold text-stone-800">Admin Panel</h1>
					</div>
					<p className="text-stone-600 mt-2">Manage users and their content</p>
					<Button
						variant="ghost"
						onClick={() => router.push("/")}
						className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 hover:cursor-pointer mt-2"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8 space-y-8">
				{/* Users Table */}
				<Card className="p-6">
					<h2 className="text-2xl font-bold text-stone-800 mb-6">
						Users ({users.length})
					</h2>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Username</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Joined</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedUsers.map((u) => (
									<TableRow
										key={u.id}
										className="cursor-pointer hover:bg-stone-50"
										onClick={() => router.push(`/admin/user/${u.id}`)}
									>
										<TableCell className="font-medium">{u.id}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<UserCircle className="w-4 h-4 text-stone-400" />
												{u.username}
												{u.is_superuser && (
													<Shield className="w-4 h-4 text-amber-600" />
												)}
											</div>
										</TableCell>
										<TableCell>{u.email}</TableCell>
										<TableCell>
											{u.first_name || u.last_name
												? `${u.first_name} ${u.last_name}`.trim()
												: "-"}
										</TableCell>
										<TableCell>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													u.is_active
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{u.is_active ? "Active" : "Inactive"}
											</span>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1 text-sm text-stone-500">
												<Calendar className="w-3 h-3" />
												{new Date(u.date_joined).toLocaleDateString()}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Users Pagination */}
					{usersTotalPages > 1 && (
						<div className="mt-6">
							<Pagination className="pagination-amber">
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
											aria-disabled={usersPage === 1}
											className={
												usersPage === 1
													? "pointer-events-none opacity-50"
													: "cursor-pointer"
											}
										/>
									</PaginationItem>

									{getUsersPageNumbers().map((page, index) =>
										page === "ellipsis" ? (
											<PaginationItem key={`users-ellipsis-${index}`}>
												<PaginationEllipsis />
											</PaginationItem>
										) : (
											<PaginationItem key={page}>
												<PaginationLink
													onClick={() => setUsersPage(page)}
													isActive={usersPage === page}
													className="cursor-pointer"
												>
													{page}
												</PaginationLink>
											</PaginationItem>
										)
									)}

									<PaginationItem>
										<PaginationNext
											onClick={() =>
												setUsersPage((p) => Math.min(usersTotalPages, p + 1))
											}
											aria-disabled={usersPage === usersTotalPages}
											className={
												usersPage === usersTotalPages
													? "pointer-events-none opacity-50"
													: "cursor-pointer"
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</Card>

				{/* Books Table */}
				<Card className="p-6">
					<h2 className="text-2xl font-bold text-stone-800 mb-6">
						Books ({books.length})
					</h2>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-20">Cover</TableHead>
									<TableHead>Title</TableHead>
									<TableHead>Author</TableHead>
									<TableHead>Genre</TableHead>
									<TableHead>Uploaded By</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedBooks.map((book) => (
									<TableRow
										key={book.id}
										className="cursor-pointer hover:bg-stone-50"
										onClick={() => router.push(`/book/${book.id}`)}
									>
										<TableCell>
											<div className="relative w-12 h-16 bg-stone-100 rounded overflow-hidden">
												{getBookCoverUrl(book) ? (
													<Image
														src={getBookCoverUrl(book)!}
														fill
														alt={book.title}
														className="object-cover"
														unoptimized={
															getBookCoverUrl(book)!.includes("localhost") ||
															getBookCoverUrl(book)!.includes("127.0.0.1")
														}
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<BookOpen className="w-6 h-6 text-stone-400" />
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											<span className="font-medium">{book.title}</span>
										</TableCell>
										<TableCell>{book.author}</TableCell>
										<TableCell>{book.genre || "-"}</TableCell>
										<TableCell>
											<div className="flex items-center gap-1 text-sm text-stone-500">
												<UserCircle className="w-3 h-3" />
												{book.user.username}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Books Pagination */}
					{booksTotalPages > 1 && (
						<div className="mt-6">
							<Pagination className="pagination-amber">
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() => setBooksPage((p) => Math.max(1, p - 1))}
											aria-disabled={booksPage === 1}
											className={
												booksPage === 1
													? "pointer-events-none opacity-50"
													: "cursor-pointer"
											}
										/>
									</PaginationItem>

									{getBooksPageNumbers().map((page, index) =>
										page === "ellipsis" ? (
											<PaginationItem key={`books-ellipsis-${index}`}>
												<PaginationEllipsis />
											</PaginationItem>
										) : (
											<PaginationItem key={page}>
												<PaginationLink
													onClick={() => setBooksPage(page)}
													isActive={booksPage === page}
													className="cursor-pointer"
												>
													{page}
												</PaginationLink>
											</PaginationItem>
										)
									)}

									<PaginationItem>
										<PaginationNext
											onClick={() =>
												setBooksPage((p) => Math.min(booksTotalPages, p + 1))
											}
											aria-disabled={booksPage === booksTotalPages}
											className={
												booksPage === booksTotalPages
													? "pointer-events-none opacity-50"
													: "cursor-pointer"
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
