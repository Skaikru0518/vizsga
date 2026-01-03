import { useState } from "react";
import { User } from "@/interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCircle, Calendar, Edit, Save, X, Trash2, Lock } from "lucide-react";

interface UserDetailsCardProps {
	user: User;
	isEditing: boolean;
	editedUser: Partial<User>;
	onEdit: () => void;
	onSave: () => void;
	onCancel: () => void;
	onDelete?: () => void;
	onUserChange: (updates: Partial<User>) => void;
	showAdminFields?: boolean;
	showDeleteButton?: boolean;
	showPasswordChange?: boolean;
	onPasswordChange?: (oldPassword: string, newPassword: string) => void;
}

export function UserDetailsCard({
	user,
	isEditing,
	editedUser,
	onEdit,
	onSave,
	onCancel,
	onDelete,
	onUserChange,
	showAdminFields = true,
	showDeleteButton = true,
	showPasswordChange = false,
	onPasswordChange,
}: UserDetailsCardProps) {
	const [showPasswordSection, setShowPasswordSection] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handlePasswordChange = () => {
		if (newPassword !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		if (onPasswordChange) {
			onPasswordChange(oldPassword, newPassword);
		}
		setShowPasswordSection(false);
		setOldPassword("");
		setNewPassword("");
		setConfirmPassword("");
	};

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
					<UserCircle className="w-7 h-7" />
					User Details
				</h2>
				<div className="flex gap-2">
					{!isEditing ? (
						<>
							<Button
								variant="outline"
								size="sm"
								className="hover:cursor-pointer"
								onClick={onEdit}
							>
								<Edit className="w-4 h-4 mr-2" />
								Edit
							</Button>
							{showDeleteButton && onDelete && (
								<Button
									variant="destructive"
									size="sm"
									className="hover:cursor-pointer"
									onClick={onDelete}
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete User
								</Button>
							)}
						</>
					) : (
						<>
							<Button variant="default" size="sm" onClick={onSave}>
								<Save className="w-4 h-4 mr-2" />
								Save
							</Button>
							<Button variant="outline" size="sm" onClick={onCancel}>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
						</>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						value={editedUser.username || ""}
						onChange={(e) => onUserChange({ username: e.target.value })}
						disabled={!isEditing}
						className="mt-1"
					/>
				</div>

				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						value={editedUser.email || ""}
						onChange={(e) => onUserChange({ email: e.target.value })}
						disabled={!isEditing}
						className="mt-1"
					/>
				</div>

				<div>
					<Label htmlFor="firstName">First Name</Label>
					<Input
						id="firstName"
						value={editedUser.first_name || ""}
						onChange={(e) => onUserChange({ first_name: e.target.value })}
						disabled={!isEditing}
						className="mt-1"
					/>
				</div>

				<div>
					<Label htmlFor="lastName">Last Name</Label>
					<Input
						id="lastName"
						value={editedUser.last_name || ""}
						onChange={(e) => onUserChange({ last_name: e.target.value })}
						disabled={!isEditing}
						className="mt-1"
					/>
				</div>

				{showAdminFields && (
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Checkbox
								id="isActive"
								checked={editedUser.is_active || false}
								onCheckedChange={(checked) =>
									onUserChange({ is_active: checked as boolean })
								}
								disabled={!isEditing}
							/>
							<Label htmlFor="isActive" className="cursor-pointer">
								Active
							</Label>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox
								id="isStaff"
								checked={editedUser.is_staff || false}
								onCheckedChange={(checked) =>
									onUserChange({ is_staff: checked as boolean })
								}
								disabled={!isEditing}
							/>
							<Label htmlFor="isStaff" className="cursor-pointer">
								Staff
							</Label>
						</div>

						<div className="flex items-center gap-2">
							<Checkbox
								id="isSuperuser"
								checked={editedUser.is_superuser || false}
								onCheckedChange={(checked) =>
									onUserChange({ is_superuser: checked as boolean })
								}
								disabled={!isEditing}
							/>
							<Label htmlFor="isSuperuser" className="cursor-pointer">
								Superuser
							</Label>
						</div>
					</div>
				)}

				<div>
					<Label>Date Joined</Label>
					<div className="flex items-center gap-2 mt-1 text-stone-600">
						<Calendar className="w-4 h-4" />
						{new Date(user.date_joined).toLocaleDateString()}
					</div>
				</div>
			</div>

			{/* Password Change Section */}
			{showPasswordChange && (
				<div className="mt-8 pt-6 border-t border-stone-200">
					{!showPasswordSection ? (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowPasswordSection(true)}
							className="hover:cursor-pointer"
						>
							<Lock className="w-4 h-4 mr-2" />
							Change Password
						</Button>
					) : (
						<div className="space-y-4 max-w-md">
							<h3 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
								<Lock className="w-5 h-5" />
								Change Password
							</h3>

							<div>
								<Label htmlFor="oldPassword">Current Password</Label>
								<Input
									id="oldPassword"
									type="password"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
									className="mt-1"
								/>
							</div>

							<div>
								<Label htmlFor="newPassword">New Password</Label>
								<Input
									id="newPassword"
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className="mt-1"
								/>
							</div>

							<div>
								<Label htmlFor="confirmPassword">Confirm New Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="mt-1"
								/>
							</div>

							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={handlePasswordChange}
									disabled={!oldPassword || !newPassword || !confirmPassword}
									className="btn-primary hover:cursor-pointer"
								>
									<Save className="w-4 h-4 mr-2" />
									Update Password
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setShowPasswordSection(false);
										setOldPassword("");
										setNewPassword("");
										setConfirmPassword("");
									}}
									className="hover:cursor-pointer"
								>
									<X className="w-4 h-4 mr-2" />
									Cancel
								</Button>
							</div>
						</div>
					)}
				</div>
			)}
		</Card>
	);
}
