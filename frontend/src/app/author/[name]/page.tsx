"use client";
import { Book } from "@/interface";
import { bookApi } from "@/lib/api-routes";
import { useEffect, useState, useMemo } from "react";
import BookCard from "@/components/shared/book-card";
import { Input } from "@/components/ui/input";
import { Search, User, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 48;

// Helper function to capitalize each word
const capitalizeWords = (str: string) => {
	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

export default function AuthorPage() {
	const [books, setBooks] = useState<Book[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [authorName, setAuthorName] = useState<string>("");
	const router = useRouter();
	const params = useParams();

	// Decode the author name from URL
	useEffect(() => {
		if (params.name && typeof params.name === "string") {
			const decodedName = decodeURIComponent(params.name).replace(/-/g, " ");
			console.log("Decoded author name:", decodedName);
			setAuthorName(decodedName);
		}
	}, [params.name]);

	useEffect(() => {
		if (!authorName) return;

		const fetchBooks = async () => {
			try {
				const response = await bookApi.getAll();
				console.log("All books:", response.data.length);
				console.log(
					"Authors in DB:",
					response.data.map((b) => b.author)
				);
				console.log("Looking for author:", authorName);
				// Filter books by author name (case-insensitive)
				const authorBooks = response.data.filter(
					(book) => book.author.toLowerCase() === authorName.toLowerCase()
				);
				console.log("Found books:", authorBooks.length);
				setBooks(authorBooks);
			} catch (error) {
				console.error("Failed to fetch books:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchBooks();
	}, [authorName]);

	// Reset to page 1 when search changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery]);

	// Filter books based on search
	const filteredBooks = useMemo(() => {
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			return books.filter((book) => book.title.toLowerCase().includes(query));
		}
		return books;
	}, [books, searchQuery]);

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
					<p className="text-sm md:text-base text-stone-600">Loading books...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen page-bg">
			{/* Hero Section */}
			<div className="hero-bg">
				<div className="container mx-auto">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 hover:cursor-pointer mb-3 md:mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
						<User className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
						<h1 className="text-3xl md:text-5xl font-bold text-amber-900">
							{authorName ? capitalizeWords(authorName) : "Loading..."}
						</h1>
					</div>
					<p className="text-amber-700 text-sm md:text-lg">
						{books.length} book{books.length !== 1 ? "s" : ""} by this author
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 pb-12">
				{/* Search Bar */}
				<div className="mb-4 md:mb-6 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-400" />
					<Input
						type="text"
						placeholder="Search books by title..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 md:pl-10 h-10 md:h-12 text-sm md:text-base"
					/>
				</div>

				{/* Results count */}
				<div className="mb-3 md:mb-4 text-xs md:text-sm text-stone-600">
					{filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}{" "}
					found
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
						<User className="w-12 h-12 md:w-16 md:h-16 text-stone-300 mx-auto mb-3 md:mb-4" />
						<p className="text-stone-500 text-base md:text-lg">
							{searchQuery
								? "No books found matching your search"
								: "No books found by this author"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
