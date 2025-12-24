"use client";
import { Book } from "@/interface";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookCardProps {
	book: Book;
}

export default function BookCard({ book }: BookCardProps) {
	const router = useRouter();
	return (
		<div
			className="group relative bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shadow-lg"
			onClick={() => router.push(`/book/${book.id}`)}
		>
			{/* Colored spine at top */}
			<div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 rounded-t-lg" />

			{/* Book Cover */}
			<div className="relative h-72 w-full bg-stone-50 rounded overflow-hidden mb-3">
				{book.coverUrl ? (
					<Image
						src={book.coverUrl}
						fill
						alt={book.title}
						className="object-contain"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-linear-to-br from-amber-100 to-stone-200">
						<BookOpen className="w-16 h-16 text-stone-400" />
					</div>
				)}

				{/* Hover overlay with description */}
				<div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-white">
					<p className="text-sm text-center line-clamp-6">
						{book.description || "Nincs elérhető leírás ehhez a könyvhöz."}
					</p>
					{book.genre && (
						<div className="mt-3 text-xs bg-amber-500 rounded-full px-3 py-1">
							{book.genre}
						</div>
					)}
				</div>
			</div>

			{/* Book Info */}
			<div className="space-y-1">
				<h3 className="font-semibold text-sm line-clamp-2 leading-tight text-stone-900">
					{book.title}
				</h3>
				<p className="text-xs text-stone-600">{book.author}</p>
			</div>
		</div>
	);
}
