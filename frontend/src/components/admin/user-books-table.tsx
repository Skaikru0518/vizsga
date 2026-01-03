import { useMemo, useState } from "react";
import { Book } from "@/interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { BookOpen, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { getBookCoverUrl } from "@/lib/utils/book-cover";

const BOOKS_PER_PAGE = 10;

interface UserBooksTableProps {
	books: Book[];
	onEdit: (book: Book) => void;
	onDelete: (bookId: number) => void;
}

export function UserBooksTable({ books, onEdit, onDelete }: UserBooksTableProps) {
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);
	const paginatedBooks = useMemo(() => {
		const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
		const endIndex = startIndex + BOOKS_PER_PAGE;
		return books.slice(startIndex, endIndex);
	}, [books, currentPage]);

	const getPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const showEllipsis = totalPages > 7;

		if (!showEllipsis) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push("ellipsis");
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("ellipsis");
			}

			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
				<BookOpen className="w-7 h-7" />
				Uploaded Books ({books.length})
			</h2>

			{books.length === 0 ? (
				<div className="text-center py-12 text-stone-500">
					<BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
					<p>This user hasn't uploaded any books yet.</p>
				</div>
			) : (
				<>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-20">Cover</TableHead>
									<TableHead>Title</TableHead>
									<TableHead>Author</TableHead>
									<TableHead>Genre</TableHead>
									<TableHead>ISBN</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedBooks.map((book) => (
									<TableRow key={book.id}>
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
										<TableCell>{book.isbn || "-"}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													className="hover:cursor-pointer"
													onClick={() => onEdit(book)}
												>
													<Edit className="w-4 h-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													className="hover:cursor-pointer"
													onClick={() => onDelete(book.id)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{totalPages > 1 && (
						<div className="mt-6">
							<Pagination className="pagination-amber">
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
						</div>
					)}
				</>
			)}
		</Card>
	);
}
