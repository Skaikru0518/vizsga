"use client";
import { Book } from "@/interface";
import { bookApi, adminApi } from "@/lib/api-routes";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
	BookOpen,
	ShoppingCart,
	CheckCircle2,
	Library,
	ArrowLeft,
	Settings,
	Trash2,
	Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { getBookCoverUrl } from "@/lib/utils/book-cover";

export default function BookDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const { user, isAuthenticated } = useUser();
	const [book, setBook] = useState<Book | null>(null);
	const [loading, setLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [manageDialogOpen, setManageDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editedBookData, setEditedBookData] = useState<Partial<Book>>({});
	const [coverType, setCoverType] = useState<"url" | "file">("url");
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [coverUrl, setCoverUrl] = useState("");
	const coverUrlDisplay = book ? getBookCoverUrl(book) : null;

	useEffect(() => {
		const fetchBook = async () => {
			try {
				const response = await bookApi.getById(params.id as string);
				setBook(response.data);
			} catch (error) {
				console.error("Failed to fetch book:", error);
				toast.error("Failed to load book details");
			} finally {
				setLoading(false);
			}
		};

		if (params.id) {
			fetchBook();
		}
	}, [params.id]);

	const handleMarkAction = async (
		action: "read" | "onBookshelf" | "bought",
		currentValue: boolean
	) => {
		if (!isAuthenticated) {
			toast.error("Please login to mark books");
			router.push("/login");
			return;
		}

		if (!book) return;

		setIsUpdating(true);
		try {
			const newValue = !currentValue;
			const markData = { [action]: newValue };

			// If no mark exists, create one. Otherwise update it.
			if (!book.user_mark) {
				await bookApi.mark.set(book.id, markData);
			} else {
				await bookApi.mark.update(book.id, markData);
			}

			// Update local state
			setBook({
				...book,
				user_mark: {
					...(book.user_mark || {
						bought: false,
						read: false,
						onBookshelf: false,
					}),
					[action]: newValue,
				},
			});

			const actionLabels = {
				read: "read",
				onBookshelf: "bookshelf",
				bought: "bought",
			};

			toast.success(
				newValue
					? `Marked as ${actionLabels[action]}`
					: `Unmarked as ${actionLabels[action]}`
			);
		} catch (error) {
			console.error(`Failed to mark book as ${action}:`, error);
			toast.error(`Failed to update book status`);
		} finally {
			setIsUpdating(false);
		}
	};

	const openManageDialog = () => {
		if (!book) return;
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
		setManageDialogOpen(true);
	};

	const handleUpdateBook = async () => {
		if (!book) return;

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

				await adminApi.books.update(book.id, formData as any);
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

				await adminApi.books.update(book.id, updateData);
			}

			toast.success("Book updated successfully");
			setManageDialogOpen(false);

			// Refresh book data
			const response = await bookApi.getById(params.id as string);
			setBook(response.data);
		} catch (error) {
			console.error("Failed to update book:", error);
			toast.error("Failed to update book");
		}
	};

	const handleDeleteBook = async () => {
		if (!book) return;

		try {
			await adminApi.books.delete(book.id);
			toast.success("Book deleted successfully");
			router.push("/");
		} catch (error) {
			console.error("Failed to delete book:", error);
			toast.error("Failed to delete book");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
					<p className="text-stone-600">Loading book details...</p>
				</div>
			</div>
		);
	}

	if (!book) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<BookOpen className="w-16 h-16 text-stone-400 mx-auto mb-4" />
					<h2 className="text-2xl font-semibold text-stone-800 mb-2">
						Book not found
					</h2>
					<p className="text-stone-600 mb-4">
						The book you're looking for doesn't exist.
					</p>
					<Button onClick={() => router.push("/")} variant="ghost">
						Go back home
					</Button>
				</div>
			</div>
		);
	}

	const isRead = book.user_mark?.read || false;
	const isOnBookshelf = book.user_mark?.onBookshelf || false;
	const isBought = book.user_mark?.bought || false;
	const isAdmin = user?.is_superuser || false;

	return (
		<div className="min-h-screen page-bg">
			{/* Hero Section */}
			<div className="hero-bg">
				<div className="container mx-auto">
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
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Side - Book Cover */}
					<div className="lg:col-span-1">
						<Card className="p-6 sticky top-8">
							<div className="relative aspect-2/3 w-full bg-stone-100 rounded-lg overflow-hidden mb-4">
								{coverUrlDisplay ? (
									<Image
										src={coverUrlDisplay}
										fill
										alt={book.title}
										className="object-contain"
										sizes="(max-width: 768px) 100vw, 33vw"
										priority
										unoptimized={
											coverUrlDisplay.includes("localhost") ||
											coverUrlDisplay.includes("127.0.0.1")
										}
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-linear-to-br from-amber-100 to-stone-200">
										<BookOpen className="w-24 h-24 text-stone-400" />
									</div>
								)}
							</div>

							{/* Genre Badge */}
							{book.genre && (
								<div className="flex justify-center mb-4">
									<span className="inline-block bg-amber-100 text-amber-800 text-sm font-medium px-4 py-2 rounded-full border border-amber-200">
										{book.genre}
									</span>
								</div>
							)}

							{/* Admin Manage Button */}
							{isAdmin && (
								<Button
									onClick={openManageDialog}
									variant="outline"
									className="w-full mb-3 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 hover:cursor-pointer"
								>
									<Settings className="mr-2 h-4 w-4" />
									Manage Book
								</Button>
							)}

							{/* Action Buttons */}
							<div className="space-y-3">
								<Button
									onClick={() => handleMarkAction("read", isRead)}
									disabled={isUpdating}
									className={`w-full ${
										isRead
											? "bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer"
											: "bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 hover:cursor-pointer"
									}`}
								>
									<CheckCircle2 className="mr-2 h-4 w-4" />
									{isRead ? "Marked as Read" : "Mark as Read"}
								</Button>

								<Button
									onClick={() => handleMarkAction("onBookshelf", isOnBookshelf)}
									disabled={isUpdating}
									className={`w-full ${
										isOnBookshelf
											? "bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer"
											: "bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 hover:cursor-pointer"
									}`}
								>
									<Library className="mr-2 h-4 w-4" />
									{isOnBookshelf ? "On Bookshelf" : "Add to Bookshelf"}
								</Button>

								<Button
									onClick={() => handleMarkAction("bought", isBought)}
									disabled={isUpdating}
									className={`w-full ${
										isBought
											? "bg-amber-600 hover:bg-amber-700 text-white hover:cursor-pointer"
											: "bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 hover:cursor-pointer"
									}`}
								>
									<ShoppingCart className="mr-2 h-4 w-4" />
									{isBought ? "Marked as Bought" : "Mark as Bought"}
								</Button>
							</div>
						</Card>
					</div>

					{/* Right Side - Book Details */}
					<div className="lg:col-span-2">
						<Card className="p-8">
							{/* Book Title and Author */}
							<div className="mb-6 pb-6 border-b border-stone-200">
								<h1 className="text-4xl font-bold text-stone-900 mb-3">
									{book.title}
								</h1>
								<p className="text-xl text-amber-700 font-medium">
									by {book.author}
								</p>
							</div>

							{/* Book Details */}
							<div className="space-y-6">
								{/* ISBN */}
								{book.isbn && (
									<div>
										<h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
											ISBN
										</h3>
										<p className="text-stone-800 font-mono">{book.isbn}</p>
									</div>
								)}

								{/* Description */}
								<div>
									<h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
										Description
									</h3>
									<div className="prose prose-stone max-w-none">
										<p className="text-stone-700 leading-relaxed whitespace-pre-line">
											{book.description ||
												"No description available for this book."}
										</p>
									</div>
								</div>

								{/* Added by */}
								<div className="pt-6 border-t border-stone-200">
									<p className="text-sm text-stone-500">
										Added by{" "}
										<span className="font-medium text-stone-700">
											{book.user.username}
										</span>
									</p>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>

			{/* Manage Book Dialog */}
			<Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white! border-amber-200!">
					<DialogHeader>
						<DialogTitle className="text-stone-800!">Manage Book</DialogTitle>
						<DialogDescription className="text-stone-600!">
							Edit book details, update cover image, or delete the book
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div>
							<Label htmlFor="manage-title" className="text-stone-700!">
								Title
							</Label>
							<Input
								id="manage-title"
								value={editedBookData.title || ""}
								onChange={(e) =>
									setEditedBookData({
										...editedBookData,
										title: e.target.value,
									})
								}
								className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
							/>
						</div>

						<div>
							<Label htmlFor="manage-author" className="text-stone-700!">
								Author
							</Label>
							<Input
								id="manage-author"
								value={editedBookData.author || ""}
								onChange={(e) =>
									setEditedBookData({
										...editedBookData,
										author: e.target.value,
									})
								}
								className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
							/>
						</div>

						<div>
							<Label htmlFor="manage-description" className="text-stone-700!">
								Description
							</Label>
							<Textarea
								id="manage-description"
								value={editedBookData.description || ""}
								onChange={(e) =>
									setEditedBookData({
										...editedBookData,
										description: e.target.value,
									})
								}
								className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
								rows={4}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="manage-genre" className="text-stone-700!">
									Genre
								</Label>
								<Input
									id="manage-genre"
									value={editedBookData.genre || ""}
									onChange={(e) =>
										setEditedBookData({
											...editedBookData,
											genre: e.target.value,
										})
									}
									className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
								/>
							</div>

							<div>
								<Label htmlFor="manage-isbn" className="text-stone-700!">
									ISBN
								</Label>
								<Input
									id="manage-isbn"
									value={editedBookData.isbn || ""}
									onChange={(e) =>
										setEditedBookData({
											...editedBookData,
											isbn: e.target.value,
										})
									}
									className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
								/>
							</div>
						</div>

						<div>
							<Label className="text-stone-700!">Cover Image</Label>
							<RadioGroup
								value={coverType}
								onValueChange={(value) => setCoverType(value as "url" | "file")}
								className="mt-2"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="url"
										id="manage-cover-url"
										className="border-stone-400! text-amber-600!"
									/>
									<Label
										htmlFor="manage-cover-url"
										className="font-normal cursor-pointer text-stone-700!"
									>
										Use URL
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="file"
										id="manage-cover-file"
										className="border-stone-400! text-amber-600!"
									/>
									<Label
										htmlFor="manage-cover-file"
										className="font-normal cursor-pointer text-stone-700!"
									>
										Upload File
									</Label>
								</div>
							</RadioGroup>

							{coverType === "url" ? (
								<Input
									placeholder="https://example.com/book-cover.jpg"
									value={coverUrl}
									onChange={(e) => setCoverUrl(e.target.value)}
									className="mt-2 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900! placeholder:text-stone-400!"
								/>
							) : (
								<Input
									type="file"
									accept="image/*"
									onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
									className="mt-2 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
								/>
							)}
						</div>
					</div>

					<DialogFooter className="flex justify-between">
						<Button
							variant="destructive"
							onClick={() => {
								setManageDialogOpen(false);
								setDeleteDialogOpen(true);
							}}
							className="hover:cursor-pointer"
						>
							<Trash2 className="w-4 h-4 mr-2" />
							Delete Book
						</Button>
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => setManageDialogOpen(false)}
								className="border-stone-300! text-stone-700! hover:bg-stone-100! hover:cursor-pointer"
							>
								Cancel
							</Button>
							<Button
								onClick={handleUpdateBook}
								className="bg-amber-600! hover:bg-amber-700! text-white! hover:cursor-pointer"
							>
								<Save className="w-4 h-4 mr-2" />
								Save Changes
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Book?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete "{book?.title}". This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteBook}
							className="bg-red-600 hover:bg-red-700 hover:cursor-pointer"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
