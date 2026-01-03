"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookOpen, ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { bookApi } from "@/lib/api-routes";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

export default function UploadBookPage() {
	const router = useRouter();
	const { isAuthenticated } = useUser();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [coverType, setCoverType] = useState<"url" | "file">("url");
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [filePreview, setFilePreview] = useState<string>("");
	const [formData, setFormData] = useState({
		title: "",
		author: "",
		description: "",
		isbn: "",
		genre: "",
		coverUrl: "",
	});

	// Redirect if not authenticated
	useEffect(() => {
		if (isAuthenticated === false) {
			router.push("/login");
		}
	}, [isAuthenticated, router]);

	// Show loading while checking authentication
	if (isAuthenticated === null || isAuthenticated === false) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
					<p className="text-stone-600">Loading...</p>
				</div>
			</div>
		);
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Check file type
			if (!file.type.startsWith("image/")) {
				toast.error("Please select an image file");
				return;
			}

			// Check file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast.error("File size must be less than 5MB");
				return;
			}

			setCoverFile(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setFilePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!formData.title.trim()) {
			toast.error("Title is required");
			return;
		}
		if (!formData.author.trim()) {
			toast.error("Author is required");
			return;
		}

		setIsSubmitting(true);

		try {
			let response;

			if (coverType === "file" && coverFile) {
				// Use FormData for file upload
				const formDataToSend = new FormData();
				formDataToSend.append("title", formData.title.trim());
				formDataToSend.append("author", formData.author.trim());
				formDataToSend.append("description", formData.description.trim());
				if (formData.isbn.trim()) {
					formDataToSend.append("isbn", formData.isbn.trim());
				}
				if (formData.genre.trim()) {
					formDataToSend.append("genre", formData.genre.trim());
				}
				formDataToSend.append("cover", coverFile);

				response = await bookApi.create(formDataToSend as any);
			} else {
				// Use JSON for URL
				const bookData = {
					title: formData.title.trim(),
					author: formData.author.trim(),
					description: formData.description.trim(),
					isbn: formData.isbn.trim() || null,
					genre: formData.genre.trim() || null,
					coverUrl: formData.coverUrl.trim() || null,
				};

				response = await bookApi.create(bookData);
			}

			toast.success("Book added successfully!");

			// Redirect to the newly created book's page
			router.push(`/book/${response.data.id}`);
		} catch (error: any) {
			console.error("Failed to create book:", error);
			toast.error(
				error.response?.data?.message || "Failed to add book. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen page-bg">
			{/* Hero Section */}
			<div className="hero-bg">
				<div className="container mx-auto">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 hover:cursor-pointer mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<div className="text-center">
						<h1 className="text-4xl font-bold text-stone-800 mb-2">
							Add New Book
						</h1>
						<p className="text-stone-600">
							Share a new book with the ReadList community
						</p>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					<Card className="p-8">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Title */}
							<div className="space-y-2">
								<Label htmlFor="title" className="text-stone-700 font-medium">
									Title <span className="text-red-500">*</span>
								</Label>
								<Input
									id="title"
									name="title"
									value={formData.title}
									onChange={handleChange}
									placeholder="Enter book title"
									required
									className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
								/>
							</div>

							{/* Author */}
							<div className="space-y-2">
								<Label htmlFor="author" className="text-stone-700 font-medium">
									Author <span className="text-red-500">*</span>
								</Label>
								<Input
									id="author"
									name="author"
									value={formData.author}
									onChange={handleChange}
									placeholder="Enter author name"
									required
									className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
								/>
							</div>

							{/* Description */}
							<div className="space-y-2">
								<Label
									htmlFor="description"
									className="text-stone-700 font-medium"
								>
									Description
								</Label>
								<Textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleChange}
									placeholder="Enter book description"
									rows={5}
									className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 resize-none"
								/>
							</div>

							{/* ISBN */}
							<div className="space-y-2">
								<Label htmlFor="isbn" className="text-stone-700 font-medium">
									ISBN
								</Label>
								<Input
									id="isbn"
									name="isbn"
									value={formData.isbn}
									onChange={handleChange}
									placeholder="Enter ISBN (optional)"
									className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
								/>
							</div>

							{/* Genre */}
							<div className="space-y-2">
								<Label htmlFor="genre" className="text-stone-700 font-medium">
									Genre
								</Label>
								<Input
									id="genre"
									name="genre"
									value={formData.genre}
									onChange={handleChange}
									placeholder="e.g., Fiction, Mystery, Science Fiction"
									className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
								/>
							</div>

							{/* Cover Image Section */}
							<div className="space-y-4">
								<Label className="text-stone-700 font-medium">
									Cover Image
								</Label>

								{/* Radio Group for cover type selection */}
								<RadioGroup
									value={coverType}
									onValueChange={(value: "url" | "file") => setCoverType(value)}
									className="flex gap-4"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="url" id="url" />
										<Label htmlFor="url" className="font-normal cursor-pointer">
											From URL
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="file" id="file" />
										<Label
											htmlFor="file"
											className="font-normal cursor-pointer"
										>
											Upload File
										</Label>
									</div>
								</RadioGroup>

								{/* URL Input */}
								{coverType === "url" && (
									<div className="space-y-2">
										<Input
											id="coverUrl"
											name="coverUrl"
											value={formData.coverUrl}
											onChange={handleChange}
											placeholder="https://example.com/cover.jpg"
											type="url"
											className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
										/>
										<p className="text-xs text-stone-500">
											Paste a URL to the book cover image
										</p>
									</div>
								)}

								{/* File Upload */}
								{coverType === "file" && (
									<div className="space-y-2">
										<div className="flex items-center justify-center w-full">
											<label
												htmlFor="cover-file"
												className="flex flex-col items-center justify-center w-full h-32 border-2 border-amber-300 border-dashed rounded-lg cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors"
											>
												<div className="flex flex-col items-center justify-center pt-5 pb-6">
													<Upload className="w-8 h-8 mb-2 text-amber-600" />
													<p className="mb-2 text-sm text-stone-700">
														<span className="font-semibold">
															Click to upload
														</span>{" "}
														or drag and drop
													</p>
													<p className="text-xs text-stone-500">
														PNG, JPG, WEBP (MAX. 5MB)
													</p>
												</div>
												<input
													id="cover-file"
													type="file"
													className="hidden"
													accept="image/*"
													onChange={handleFileChange}
												/>
											</label>
										</div>
										{coverFile && (
											<p className="text-sm text-stone-600">
												Selected: {coverFile.name}
											</p>
										)}
									</div>
								)}

								{/* Preview */}
								{((coverType === "url" && formData.coverUrl) ||
									(coverType === "file" && filePreview)) && (
									<div className="space-y-2">
										<Label className="text-stone-700 font-medium">
											Cover Preview
										</Label>
										<div className="relative w-32 h-48 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
											<img
												src={
													coverType === "url" ? formData.coverUrl : filePreview
												}
												alt="Cover preview"
												className="w-full h-full object-contain"
												onError={(e) => {
													e.currentTarget.src = "";
													e.currentTarget.style.display = "none";
												}}
											/>
										</div>
									</div>
								)}
							</div>

							{/* Submit Buttons */}
							<div className="flex gap-4 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
									className="flex-1 border-stone-300 hover:bg-stone-100 hover:cursor-pointer"
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="flex-1 bg-amber-600 hover:bg-amber-700 text-white hover:cursor-pointer"
								>
									{isSubmitting ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
											Adding Book...
										</>
									) : (
										<>
											<Upload className="mr-2 h-4 w-4" />
											Add Book
										</>
									)}
								</Button>
							</div>
						</form>
					</Card>

					{/* Help Text */}
					<div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
						<div className="flex gap-3">
							<BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
							<div className="text-sm text-stone-700">
								<p className="font-medium text-amber-800 mb-1">
									Tips for adding books:
								</p>
								<ul className="list-disc list-inside space-y-1 text-stone-600">
									<li>Make sure the title and author are spelled correctly</li>
									<li>
										You can upload a cover image from your device or provide a
										URL from sites like Open Library or Goodreads
									</li>
									<li>
										Maximum file size for cover images is 5MB (PNG, JPG, WEBP)
									</li>
									<li>
										ISBN helps identify the book uniquely (found on the back
										cover)
									</li>
									<li>A good description helps others discover the book</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
