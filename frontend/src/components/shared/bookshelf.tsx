"use client";
import { Book } from "@/interface";
import Image from "next/image";
import { BookOpen, Library } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { getBookCoverUrl } from "@/lib/utils/book-cover";

interface BookshelfProps {
	books: Book[];
}

export default function Bookshelf({ books }: BookshelfProps) {
	const router = useRouter();

	if (books.length === 0) {
		return null;
	}

	// Limit to max 10 books for display
	const displayBooks = books.slice(0, 10);

	// Generate stable heights based on book ID
	const bookHeights = useMemo(() => {
		return displayBooks.reduce((acc, book) => {
			// Use book ID to generate a stable "random" height
			const seed = book.id;
			const height = 160 + ((seed * 9301 + 49297) % 233) / 233 * 40;
			acc[book.id] = height;
			return acc;
		}, {} as Record<number, number>);
	}, [displayBooks]);

	return (
		<div className="mb-8">
			<h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2">
				<Library className="w-6 h-6 text-amber-600" />
				My Bookshelf
			</h2>

			{/* Bookshelf Container */}
			<div className="relative bg-linear-to-b from-amber-900/10 to-amber-950/20 rounded-lg p-6 shadow-lg">
				{/* Books on shelf */}
				<div className="flex items-end gap-2 min-h-50 pb-4 overflow-x-auto">
					{displayBooks.map((book) => {
				const coverUrl = getBookCoverUrl(book);
				return (
						<div
							key={book.id}
							onClick={() => router.push(`/book/${book.id}`)}
							className="group relative shrink-0 w-28 cursor-pointer transition-all duration-300 hover:-translate-y-2"
							style={{
								height: `${bookHeights[book.id]}px`,
							}}
						>
							{/* Book spine/cover */}
							<div className="h-full w-full bg-white rounded-sm shadow-md border-l-2 border-r border-t border-b border-stone-300 hover:shadow-xl transition-shadow overflow-hidden">
								{coverUrl ? (
									<div className="relative h-full w-full">
										<Image
											src={coverUrl}
											fill
											alt={book.title}
											className="object-cover"
											sizes="112px"
											unoptimized={coverUrl.includes('localhost') || coverUrl.includes('127.0.0.1')}
										/>
										{/* Overlay on hover */}
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
									</div>
								) : (
									<div className="h-full w-full bg-linear-to-br from-amber-100 to-stone-200 flex items-center justify-center p-2">
										<div className="text-center">
											<BookOpen className="w-8 h-8 text-stone-500 mx-auto mb-1" />
											<p className="text-[8px] line-clamp-3 text-stone-700 font-medium">
												{book.title}
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Tooltip on hover */}
							<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
								<div className="bg-stone-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
									{book.title}
								</div>
							</div>
						</div>
					);
				})}
				</div>

				{/* Wooden shelf */}
				<div className="h-4 bg-linear-to-b from-amber-800 to-amber-950 rounded-sm shadow-lg border-t-2 border-amber-700" />

				{/* Show count if more than 10 */}
				{books.length > 10 && (
					<p className="text-sm text-stone-600 mt-3 text-center">
						Showing {displayBooks.length} of {books.length} books on your shelf
					</p>
				)}
			</div>
		</div>
	);
}
