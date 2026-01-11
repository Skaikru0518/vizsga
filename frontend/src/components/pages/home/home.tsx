"use client";
import { Book } from "@/interface";
import { bookApi } from "@/lib/api-routes";
import { useEffect, useState, useMemo } from "react";
import BookCard from "@/components/shared/book-card";
import { Input } from "@/components/ui/input";
import {
	Search,
	BookOpen,
	Library,
	LogIn,
	Users,
	Tags,
	Clock,
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

const ITEMS_PER_PAGE = 48;

export default function HomePage() {
	const [books, setBooks] = useState<Book[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const { isAuthenticated } = useUser();
	const router = useRouter();

	useEffect(() => {
		const booksPromise = async () => {
			const response = await bookApi.getAll();
			setBooks(response.data);
		};
		booksPromise();
	}, []);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, activeCategory]);

	// Filter books based on search and category
	const filteredBooks = useMemo(() => {
		let filtered = books;

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
	}, [books, searchQuery, activeCategory]);

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
			// Show all pages if 7 or fewer
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage > 3) {
				pages.push("ellipsis");
			}

			// Show pages around current page
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("ellipsis");
			}

			// Always show last page
			pages.push(totalPages);
		}

		return pages;
	};

	// Calculate stats
	const stats = useMemo(() => {
		const uniqueAuthors = new Set(books.map((book) => book.author)).size;
		const uniqueGenres = new Set(
			books.map((book) => book.genre || "Uncategorized")
		).size;
		const recentlyAddedCount = Math.min(12, books.length);

		return {
			totalBooks: books.length,
			uniqueAuthors,
			uniqueGenres,
			recentlyAdded: recentlyAddedCount,
		};
	}, [books]);

	return (
		<div className="min-h-screen page-bg">
			{/* Hero Section */}
			<div className="hero-bg">
				{/* Background logo */}
				<div className="container mx-auto relative z-10">
					<h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-3 text-amber-900">
						ReadList
					</h1>
					<p className="text-amber-700 text-sm md:text-lg mb-4 md:mb-6">
						Your personal book library
					</p>

					{/* Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
						<div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-sm border border-amber-200/50">
							<div className="flex items-center gap-1.5 md:gap-2 mb-1">
								<Library className="w-4 h-4 md:w-5 md:h-5 text-amber-700" />
								<span className="text-xs md:text-sm text-amber-600">Total Books</span>
							</div>
							<div className="text-2xl md:text-3xl font-bold text-amber-900">
								{stats.totalBooks}
							</div>
						</div>
						<div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-sm border border-amber-200/50">
							<div className="flex items-center gap-1.5 md:gap-2 mb-1">
								<Users className="w-4 h-4 md:w-5 md:h-5 text-amber-700" />
								<span className="text-xs md:text-sm text-amber-600">Authors</span>
							</div>
							<div className="text-2xl md:text-3xl font-bold text-amber-900">
								{stats.uniqueAuthors}
							</div>
						</div>
						<div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-sm border border-amber-200/50">
							<div className="flex items-center gap-1.5 md:gap-2 mb-1">
								<Tags className="w-4 h-4 md:w-5 md:h-5 text-amber-700" />
								<span className="text-xs md:text-sm text-amber-600">Genres</span>
							</div>
							<div className="text-2xl md:text-3xl font-bold text-amber-900">
								{stats.uniqueGenres}
							</div>
						</div>
						<div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-sm border border-amber-200/50">
							<div className="flex items-center gap-1.5 md:gap-2 mb-1">
								<Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-700" />
								<span className="text-xs md:text-sm text-amber-600">Recently Added</span>
							</div>
							<div className="text-2xl md:text-3xl font-bold text-amber-900">
								{stats.recentlyAdded}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 pb-12">
				{/* Search Bar */}
				<div className="mb-4 md:mb-6 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-400" />
					<Input
						type="text"
						placeholder="Search by title or author..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 md:pl-10 h-10 md:h-12 text-sm md:text-base"
					/>
				</div>

				{/* Category Tabs */}
				<Tabs
					value={activeCategory}
					onValueChange={(value) => setActiveCategory(value as FilterCategory)}
					className="mb-6 md:mb-8"
				>
					<TabsList className="tabs-amber grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-2">
						<TabsTrigger value="all" className="tab-amber py-3 cursor-pointer">
							<Library className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">All Books</span>
							<span className="sm:hidden">All</span>
						</TabsTrigger>
						<TabsTrigger
							value="bought"
							className="tab-amber py-3 cursor-pointer"
						>
							<ShoppingCart className="w-4 h-4 mr-2" />
							Bought
						</TabsTrigger>
						<TabsTrigger value="read" className="tab-amber py-3 cursor-pointer">
							<CheckCircle2 className="w-4 h-4 mr-2" />
							Read
						</TabsTrigger>
						<TabsTrigger
							value="onBookshelf"
							className="tab-amber py-3 cursor-pointer"
						>
							<BookOpen className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">On Shelf</span>
							<span className="sm:hidden">Shelf</span>
						</TabsTrigger>
					</TabsList>
				</Tabs>

				{/* Results count */}
				<div className="mb-3 md:mb-4 text-xs md:text-sm text-stone-600">
					{filteredBooks.length} books found
					{totalPages > 1 && (
						<span className="ml-2">
							(Page {currentPage} of {totalPages})
						</span>
					)}
				</div>

				{/* Books Grid */}
				{filteredBooks.length > 0 ? (
					<>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
							{paginatedBooks.map((book) => (
								<BookCard key={book.id} book={book} />
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-6 md:mt-8">
								<Pagination className="pagination-amber">
									<PaginationContent className="gap-1 md:gap-2">
										<PaginationItem>
											<PaginationPrevious
												onClick={() =>
													setCurrentPage((p) => Math.max(1, p - 1))
												}
												aria-disabled={currentPage === 1}
												className={
													currentPage === 1
														? "pointer-events-none opacity-50 h-8 md:h-10 px-2 md:px-4 text-xs md:text-sm"
														: "cursor-pointer h-8 md:h-10 px-2 md:px-4 text-xs md:text-sm"
												}
											/>
										</PaginationItem>

										{getPageNumbers().map((page, index) =>
											page === "ellipsis" ? (
												<PaginationItem key={`ellipsis-${index}`}>
													<PaginationEllipsis className="h-8 md:h-10 w-8 md:w-10" />
												</PaginationItem>
											) : (
												<PaginationItem key={page}>
													<PaginationLink
														onClick={() => setCurrentPage(page)}
														isActive={currentPage === page}
														className="cursor-pointer h-8 md:h-10 w-8 md:w-10 text-xs md:text-sm"
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
														? "pointer-events-none opacity-50 h-8 md:h-10 px-2 md:px-4 text-xs md:text-sm"
														: "cursor-pointer h-8 md:h-10 px-2 md:px-4 text-xs md:text-sm"
												}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
					</>
				) : (
					<div className="text-center py-12 md:py-16">
						{!isAuthenticated && activeCategory !== "all" ? (
							<>
								<LogIn className="w-12 h-12 md:w-16 md:h-16 text-amber-400 mx-auto mb-3 md:mb-4" />
								<h3 className="text-xl md:text-2xl font-semibold text-stone-800 mb-2">
									Join now to track your books
								</h3>
								<p className="text-stone-500 text-sm md:text-lg mb-4 md:mb-6">
									Sign in to mark books as bought, read, or add them to your
									shelf
								</p>
								<Button
									onClick={() => router.push("/login")}
									className="btn-primary h-10 md:h-11 text-sm md:text-base"
								>
									<LogIn className="w-4 h-4 mr-2" />
									Sign In
								</Button>
							</>
						) : (
							<>
								<BookOpen className="w-12 h-12 md:w-16 md:h-16 text-stone-300 mx-auto mb-3 md:mb-4" />
								<p className="text-stone-500 text-base md:text-lg">
									{searchQuery
										? "No results found"
										: "No books in this category yet"}
								</p>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
