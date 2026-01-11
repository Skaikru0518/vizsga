"use client";
import { Book } from "@/interface";
import { bookApi } from "@/lib/api-routes";
import { useEffect, useState, useMemo } from "react";
import BookCard from "@/components/shared/book-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	BookOpenCheck,
	User,
	Calendar,
	Sparkles,
	ChevronRight,
	Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export default function BrowsePage() {
	const [books, setBooks] = useState<Book[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	useEffect(() => {
		const booksPromise = async () => {
			const response = await bookApi.getAll();
			setBooks(response.data);
		};
		booksPromise();
	}, []);

	// Group books by genre
	const booksByGenre = useMemo(() => {
		const genres: Record<string, Book[]> = {};
		books.forEach((book) => {
			const genre = book.genre || "Uncategorized";
			if (!genres[genre]) {
				genres[genre] = [];
			}
			genres[genre].push(book);
		});
		const entries = Object.entries(genres).sort(([a], [b]) =>
			a.localeCompare(b)
		);

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			return entries.filter(([genre]) => genre.toLowerCase().includes(query));
		}
		return entries;
	}, [books, searchQuery]);

	// Group books by author
	const booksByAuthor = useMemo(() => {
		const authors: Record<string, Book[]> = {};
		books.forEach((book) => {
			if (!authors[book.author]) {
				authors[book.author] = [];
			}
			authors[book.author].push(book);
		});
		const entries = Object.entries(authors).sort(([a], [b]) =>
			a.localeCompare(b)
		);

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			return entries.filter(([author]) => author.toLowerCase().includes(query));
		}
		return entries;
	}, [books, searchQuery]);

	// Recently added books
	const recentBooks = useMemo(() => {
		const recent = [...books].reverse().slice(0, 12);

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			return recent.filter(
				(book) =>
					book.title.toLowerCase().includes(query) ||
					book.author.toLowerCase().includes(query)
			);
		}
		return recent;
	}, [books, searchQuery]);

	// Special collections
	const specialCollections = useMemo(() => {
		const unread = books.filter(
			(b) => b.user_mark?.bought && !b.user_mark?.read
		);
		const toRead = books.filter(
			(b) => !b.user_mark?.bought && !b.user_mark?.read
		);
		const finished = books.filter((b) => b.user_mark?.read);

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			const filterBooks = (bookList: Book[]) =>
				bookList.filter(
					(book) =>
						book.title.toLowerCase().includes(query) ||
						book.author.toLowerCase().includes(query)
				);

			return {
				unread: filterBooks(unread),
				toRead: filterBooks(toRead),
				finished: filterBooks(finished),
			};
		}

		return { unread, toRead, finished };
	}, [books, searchQuery]);

	return (
		<div className="min-h-screen page-bg">
			{/* Header */}
			<div className="hero-bg">
				<div className="container mx-auto">
					<h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-3 text-amber-900">
						Browse Books
					</h1>
					<p className="text-amber-700 text-sm md:text-lg">
						Discover books by genre, author, or explore curated collections
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 pb-12">
				{/* Search Bar */}
				<div className="mb-4 md:mb-6 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-stone-400" />
					<Input
						type="text"
						placeholder="Search in current tab..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 md:pl-10 h-10 md:h-12 text-sm md:text-base"
					/>
				</div>

				<Tabs defaultValue="genre" className="w-full">
					<TabsList className="tabs-amber grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-2 mb-8">
						<TabsTrigger
							value="genre"
							className="tab-amber py-3 cursor-pointer"
						>
							<BookOpenCheck className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">By Genre</span>
							<span className="sm:hidden">Genre</span>
						</TabsTrigger>
						<TabsTrigger
							value="author"
							className="tab-amber py-3 cursor-pointer"
						>
							<User className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">By Author</span>
							<span className="sm:hidden">Author</span>
						</TabsTrigger>
						<TabsTrigger
							value="recent"
							className="tab-amber py-3 cursor-pointer"
						>
							<Calendar className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">Recently Added</span>
							<span className="sm:hidden">Recent</span>
						</TabsTrigger>
						<TabsTrigger
							value="collections"
							className="tab-amber py-3 cursor-pointer"
						>
							<Sparkles className="w-4 h-4 mr-2" />
							<span className="hidden sm:inline">Collections</span>
							<span className="sm:hidden">Collections</span>
						</TabsTrigger>
					</TabsList>

					{/* By Genre */}
					<TabsContent value="genre" className="space-y-6 md:space-y-8">
						{booksByGenre.map(([genre, genreBooks]) => (
							<div key={genre}>
								<div className="flex items-center justify-between mb-3 md:mb-4">
									<h2 className="text-xl md:text-2xl font-bold text-stone-800">{genre}</h2>
									<span className="text-xs md:text-sm text-stone-500">
										{genreBooks.length} book{genreBooks.length !== 1 ? "s" : ""}
									</span>
								</div>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
									{genreBooks.slice(0, 6).map((book) => (
										<BookCard key={book.id} book={book} />
									))}
								</div>
							</div>
						))}
					</TabsContent>

					{/* By Author */}
					<TabsContent value="author" className="space-y-4 md:space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
							{booksByAuthor.map(([author, authorBooks]) => (
								<Card
									key={author}
									className="cursor-pointer hover:shadow-lg transition-shadow"
									onClick={() => {
										// Navigate to author page with encoded name
										const encodedAuthor = author.toLowerCase().replace(/\s+/g, "-");
										router.push(`/author/${encodedAuthor}`);
									}}
								>
									<CardHeader className="p-4 md:p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-base md:text-lg mb-1 md:mb-2">{author}</CardTitle>
												<CardDescription className="text-xs md:text-sm">
													{authorBooks.length} book
													{authorBooks.length !== 1 ? "s" : ""}
												</CardDescription>
											</div>
											<ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-stone-400" />
										</div>
										<div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4 flex-wrap">
											{authorBooks.slice(0, 3).map((book) => (
												<div
													key={book.id}
													className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded"
												>
													{book.title.length > 20
														? book.title.substring(0, 20) + "..."
														: book.title}
												</div>
											))}
											{authorBooks.length > 3 && (
												<div className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
													+{authorBooks.length - 3} more
												</div>
											)}
										</div>
									</CardHeader>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Recently Added */}
					<TabsContent value="recent">
						<h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-4 md:mb-6">
							Latest additions to the library
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
							{recentBooks.map((book) => (
								<BookCard key={book.id} book={book} />
							))}
						</div>
					</TabsContent>

					{/* Collections */}
					<TabsContent value="collections" className="space-y-6 md:space-y-8">
						{/* Unread (bought but not read) */}
						{specialCollections.unread.length > 0 && (
							<div>
								<h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-1.5 md:mb-2">
									To Read
								</h2>
								<p className="text-stone-600 text-sm md:text-base mb-3 md:mb-4">
									Books you own but haven't read yet
								</p>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
									{specialCollections.unread.map((book) => (
										<BookCard key={book.id} book={book} />
									))}
								</div>
							</div>
						)}

						{/* Finished */}
						{specialCollections.finished.length > 0 && (
							<div>
								<h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-1.5 md:mb-2">
									Finished Reading
								</h2>
								<p className="text-stone-600 text-sm md:text-base mb-3 md:mb-4">Books you've completed</p>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
									{specialCollections.finished.map((book) => (
										<BookCard key={book.id} book={book} />
									))}
								</div>
							</div>
						)}

						{/* Wishlist */}
						{specialCollections.toRead.length > 0 && (
							<div>
								<h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-1.5 md:mb-2">
									Wishlist
								</h2>
								<p className="text-stone-600 text-sm md:text-base mb-3 md:mb-4">Books you want to get</p>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
									{specialCollections.toRead.map((book) => (
										<BookCard key={book.id} book={book} />
									))}
								</div>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
