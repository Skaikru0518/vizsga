import { Book } from "@/interface";
import { Button } from "@/components/ui/button";
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
import { Save } from "lucide-react";

interface EditBookDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bookData: Partial<Book>;
	onBookDataChange: (updates: Partial<Book>) => void;
	coverType: "url" | "file";
	onCoverTypeChange: (type: "url" | "file") => void;
	coverUrl: string;
	onCoverUrlChange: (url: string) => void;
	onCoverFileChange: (file: File | null) => void;
	onSave: () => void;
}

export function EditBookDialog({
	open,
	onOpenChange,
	bookData,
	onBookDataChange,
	coverType,
	onCoverTypeChange,
	coverUrl,
	onCoverUrlChange,
	onCoverFileChange,
	onSave,
}: EditBookDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white! border-amber-200!">
				<DialogHeader>
					<DialogTitle className="text-stone-800!">Edit Book</DialogTitle>
					<DialogDescription className="text-stone-600!">
						Update book details and cover image
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<Label htmlFor="edit-title" className="text-stone-700!">
							Title
						</Label>
						<Input
							id="edit-title"
							value={bookData.title || ""}
							onChange={(e) => onBookDataChange({ title: e.target.value })}
							className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
						/>
					</div>

					<div>
						<Label htmlFor="edit-author" className="text-stone-700!">
							Author
						</Label>
						<Input
							id="edit-author"
							value={bookData.author || ""}
							onChange={(e) => onBookDataChange({ author: e.target.value })}
							className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
						/>
					</div>

					<div>
						<Label htmlFor="edit-description" className="text-stone-700!">
							Description
						</Label>
						<Textarea
							id="edit-description"
							value={bookData.description || ""}
							onChange={(e) => onBookDataChange({ description: e.target.value })}
							className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
							rows={4}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="edit-genre" className="text-stone-700!">
								Genre
							</Label>
							<Input
								id="edit-genre"
								value={bookData.genre || ""}
								onChange={(e) => onBookDataChange({ genre: e.target.value })}
								className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
							/>
						</div>

						<div>
							<Label htmlFor="edit-isbn" className="text-stone-700!">
								ISBN
							</Label>
							<Input
								id="edit-isbn"
								value={bookData.isbn || ""}
								onChange={(e) => onBookDataChange({ isbn: e.target.value })}
								className="mt-1 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
							/>
						</div>
					</div>

					<div>
						<Label className="text-stone-700!">Cover Image</Label>
						<RadioGroup
							value={coverType}
							onValueChange={(value) => onCoverTypeChange(value as "url" | "file")}
							className="mt-2"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="url"
									id="cover-url"
									className="border-stone-400! text-amber-600!"
								/>
								<Label
									htmlFor="cover-url"
									className="font-normal cursor-pointer text-stone-700!"
								>
									Use URL
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="file"
									id="cover-file"
									className="border-stone-400! text-amber-600!"
								/>
								<Label
									htmlFor="cover-file"
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
								onChange={(e) => onCoverUrlChange(e.target.value)}
								className="mt-2 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900! placeholder:text-stone-400!"
							/>
						) : (
							<Input
								type="file"
								accept="image/*"
								onChange={(e) => onCoverFileChange(e.target.files?.[0] || null)}
								className="mt-2 border-stone-300! focus:border-amber-500! focus:ring-amber-500! text-stone-900!"
							/>
						)}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="border-stone-300! text-stone-700! hover:bg-stone-100! hover:cursor-pointer"
					>
						Cancel
					</Button>
					<Button
						onClick={onSave}
						className="bg-amber-600! hover:bg-amber-700! text-white! hover:cursor-pointer"
					>
						<Save className="w-4 h-4 mr-2" />
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
