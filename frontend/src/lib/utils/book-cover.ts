import { Book } from "@/interface";

/**
 * Get the cover URL for a book, prioritizing uploaded files over external URLs
 * @param book - The book object
 * @returns The cover URL or null if no cover is available
 */
export function getBookCoverUrl(book: Book): string | null {
	// Priority 1: Uploaded cover file
	if (book.cover) {
		// Check if backend already returned a full URL (starts with http:// or https://)
		if (book.cover.startsWith('http://') || book.cover.startsWith('https://')) {
			return book.cover;
		}

		// Check if backend already includes /media/ prefix
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
		if (book.cover.startsWith('/media/')) {
			// Backend already includes /media/, just prepend base URL
			return `${baseUrl}${book.cover}`;
		}

		// Otherwise, backend returned a relative path like "images/filename.jpg"
		// We need to prepend the media URL
		return `${baseUrl}/media/${book.cover}`;
	}

	// Priority 2: External URL
	if (book.coverUrl) {
		return book.coverUrl;
	}

	// No cover available
	return null;
}
