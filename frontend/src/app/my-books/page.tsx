"use client";
import { Book } from "@/interface";
import { bookApi } from "@/lib/api-routes";
import { useEffect, useState, useMemo } from "react";
import BookCard from "@/components/shared/book-card";
import Bookshelf from "@/components/shared/bookshelf";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
	Search,
	BookOpen,
	Library,
	ShoppingCart,
	CheckCircle2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type FilterCategory = "all" | "bought" | "read" | "onBookshelf";

const ITEMS_PER_PAGE = 50;

export default function MyBooksPage() {
	const [books, setBooks] = useState<Book[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const { isAuthenticated, user } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		const fetchBooks = async () => {
			try {
				const response = await bookApi.getAll();
				setBooks(response.data);
			} catch (error) {
				console.error("Failed to fetch books:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBooks();
	}, [isAuthenticated, router]);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, activeCategory]);

	// Filter books to only show marked books
	const myBooks = useMemo(() => {
		return books.filter((book) => book.user_mark !== null);
	}, [books]);

	// Filter books based on search and category
	const filteredBooks = useMemo(() => {
		let filtered = myBooks;

		// Apply category filter
		if (activeCategory !== "all") {
			filtered = filtered.filter(
				(book) => book.user_mark && book.user_mark[activeCategory]
			);
		}

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(book) =>
					book.title.toLowerCase().includes(query) ||
					book.author.toLowerCase().includes(query)
			);
		}

		return filtered;
	}, [myBooks, searchQuery, activeCategory]);

	// Books on shelf for the bookshelf component
	const shelfBooks = useMemo(() => {
		return myBooks.filter((book) => book.user_mark?.onBookshelf);
	}, [myBooks]);

	// Statistics
	const stats = useMemo(() => {
		return {
			total: myBooks.length,
			read: myBooks.filter((book) => book.user_mark?.read).length,
			onBookshelf: myBooks.filter((book) => book.user_mark?.onBookshelf).length,
			bought: myBooks.filter((book) => book.user_mark?.bought).length,
		};
	}, [myBooks]);

	// Pagination calculations
	const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
	const paginatedBooks = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return filteredBooks.slice(startIndex, endIndex);
	}, [filteredBooks, currentPage]);

	// Generate page numbers for pagination
	const getPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const showEllipsis = totalPages > 7;

		if (!showEllipsis) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push("ellipsis");

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) pages.push("ellipsis");
			pages.push(totalPages);
		}
		return pages;
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 md:h-16 w-12 md:w-16 border-b-2 border-amber-600 mx-auto mb-3 md:mb-4"></div>
					<p className="text-sm md:text-base text-stone-600">
						Loading your books...
					</p>
				</div>
			</div>
		);
	}

	// Empty state - no books marked yet
	if (myBooks.length === 0) {
		return (
			<div className="min-h-screen page-bg">
				<div className="hero-bg">
					<div className="container mx-auto text-center">
						<h1 className="text-3xl md:text-4xl font-bold text-stone-800">
							My Books
						</h1>
					</div>
				</div>

				<div className="container mx-auto px-4 py-8 md:py-16">
					<div className="max-w-md mx-auto text-center">
						<BookOpen className="w-16 md:w-20 h-16 md:h-20 text-stone-400 mx-auto mb-4 md:mb-6" />
						<h2 className="text-xl md:text-2xl font-semibold text-stone-800 mb-2 md:mb-3">
							No books in your collection yet
						</h2>
						<p className="text-sm md:text-base text-stone-600 mb-4 md:mb-6">
							Start building your reading collection by marking books as read,
							adding them to your bookshelf, or marking them as bought.
						</p>
						<Button
							onClick={() => router.push("/browse")}
							className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
						>
							Browse Books
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen page-bg">
			{/* Hero Section */}
			<div className="hero-bg">
				<div className="container mx-auto text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
						My Books
					</h1>
					<p className="text-sm md:text-base text-stone-600">
						Welcome back, {user?.username}! Here's your reading collection.
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 py-6 md:py-8">
				{/* Statistics Cards */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
					<Card className="p-4 md:p-6 bg-white border-l-4 border-l-amber-500">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs md:text-sm text-stone-600 mb-1">
									Total Books
								</p>
								<p className="text-2xl md:text-3xl font-bold text-stone-800">
									{stats.total}
								</p>
							</div>
							<BookOpen className="w-8 md:w-12 h-8 md:h-12 text-amber-500 opacity-20" />
						</div>
					</Card>

					<Card className="p-4 md:p-6 bg-white border-l-4 border-l-green-500">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs md:text-sm text-stone-600 mb-1">
									Books Read
								</p>
								<p className="text-2xl md:text-3xl font-bold text-stone-800">
									{stats.read}
								</p>
							</div>
							<CheckCircle2 className="w-8 md:w-12 h-8 md:h-12 text-green-500 opacity-20" />
						</div>
					</Card>

					<Card className="p-4 md:p-6 bg-white border-l-4 border-l-blue-500">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs md:text-sm text-stone-600 mb-1">
									On Bookshelf
								</p>
								<p className="text-2xl md:text-3xl font-bold text-stone-800">
									{stats.onBookshelf}
								</p>
							</div>
							<Library className="w-8 md:w-12 h-8 md:h-12 text-blue-500 opacity-20" />
						</div>
					</Card>

					<Card className="p-4 md:p-6 bg-white border-l-4 border-l-amber-600">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs md:text-sm text-stone-600 mb-1">
									Books Bought
								</p>
								<p className="text-2xl md:text-3xl font-bold text-stone-800">
									{stats.bought}
								</p>
							</div>
							<ShoppingCart className="w-8 md:w-12 h-8 md:h-12 text-amber-600 opacity-20" />
						</div>
					</Card>
				</div>

				{/* Bookshelf Visual Component */}
				<Bookshelf books={shelfBooks} />

				{/* Search Bar */}
				<div className="mb-4 md:mb-6">
					<div className="relative max-w-md">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 md:w-5 h-4 md:h-5" />
						<Input
							type="text"
							placeholder="Search by title or author..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 md:pl-10 h-10 md:h-11 text-sm md:text-base bg-white border-amber-200 focus:border-amber-400 focus:ring-amber-400"
						/>
					</div>
				</div>

				{/* Tabs */}
				<Tabs
					value={activeCategory}
					onValueChange={(value) => setActiveCategory(value as FilterCategory)}
					className="mb-6"
				>
					<TabsList className="tabs-amber grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-2">
						<TabsTrigger value="all" className="tab-amber py-3 cursor-pointer">
							<BookOpen className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">All</span>
							<span className="sm:hidden">All</span> ({myBooks.length})
						</TabsTrigger>
						<TabsTrigger value="read" className="tab-amber py-3 cursor-pointer">
							<CheckCircle2 className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">Read</span>
							<span className="sm:hidden">Read</span> ({stats.read})
						</TabsTrigger>
						<TabsTrigger
							value="onBookshelf"
							className="tab-amber py-3 cursor-pointer"
						>
							<Library className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">On Shelf</span>
							<span className="sm:hidden">Shelf</span> ({stats.onBookshelf})
						</TabsTrigger>
						<TabsTrigger value="bought" className="tab-amber py-3 cursor-pointer">
							<ShoppingCart className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">Bought</span>
							<span className="sm:hidden">Bought</span> ({stats.bought})
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Books Grid */}
				{filteredBooks.length === 0 ? (
					<div className="text-center py-12 md:py-16">
						<BookOpen className="w-12 md:w-16 h-12 md:h-16 text-stone-400 mx-auto mb-3 md:mb-4" />
						<h3 className="text-lg md:text-xl font-semibold text-stone-700 mb-2">
							No books found
						</h3>
						<p className="text-sm md:text-base text-stone-600">
							{searchQuery
								? "Try adjusting your search query"
								: "No books in this category yet"}
						</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
							{paginatedBooks.map((book) => (
								<BookCard key={book.id} book={book} />
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-8">
								<Pagination className="pagination-amber">
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												onClick={() =>
													setCurrentPage((p) => Math.max(1, p - 1))
												}
												aria-disabled={currentPage === 1}
												className={
													currentPage === 1
														? "pointer-events-none opacity-50"
														: "cursor-pointer"
												}
											/>
										</PaginationItem>

										{getPageNumbers().map((page, index) =>
											page === "ellipsis" ? (
												<PaginationItem key={`ellipsis-${index}`}>
													<PaginationEllipsis />
												</PaginationItem>
											) : (
												<PaginationItem key={page}>
													<PaginationLink
														onClick={() => setCurrentPage(page)}
														isActive={currentPage === page}
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
													setCurrentPage((p) => Math.min(totalPages, p + 1))
												}
												aria-disabled={currentPage === totalPages}
												className={
													currentPage === totalPages
														? "pointer-events-none opacity-50"
														: "cursor-pointer"
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>

								{/* Page info */}
								<p className="text-center text-xs md:text-sm text-stone-600 mt-4">
									Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
									{Math.min(currentPage * ITEMS_PER_PAGE, filteredBooks.length)}{" "}
									of {filteredBooks.length} books
								</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
