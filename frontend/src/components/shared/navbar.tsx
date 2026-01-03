"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, User, BookMarked, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Logo } from "./logo";
import { useUser } from "@/hooks";
import { useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
	const { user, logout } = useUser();
	const isMobile = useIsMobile();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		setMobileMenuOpen(false);
	};

	const closeMobileMenu = () => setMobileMenuOpen(false);

	return (
		<nav className="relative z-50 border-b bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center gap-2 hover:opacity-80 transition-opacity"
					>
						<Image
							src={"/logo2.svg"}
							width={10}
							height={10}
							alt="Logo"
							className="h-10 w-10"
						/>
						<span className="text-xl font-bold text-amber-800">ReadList</span>
					</Link>

					{/* Desktop Navigation */}
					{!isMobile && (
						<>
							<NavigationMenu viewport={isMobile}>
								<NavigationMenuList>
									<NavigationMenuItem>
										<NavigationMenuLink
											asChild
											className={navigationMenuTriggerStyle()}
										>
											<Link href="/">Home</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
									<NavigationMenuItem>
										<NavigationMenuLink
											asChild
											className={navigationMenuTriggerStyle()}
										>
											<Link href="/browse">Browse</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
									{user && (
										<NavigationMenuItem>
											<NavigationMenuLink
												asChild
												className={navigationMenuTriggerStyle()}
											>
												<Link href="/my-books">My Books</Link>
											</NavigationMenuLink>
										</NavigationMenuItem>
									)}
								</NavigationMenuList>
							</NavigationMenu>

							{/* Desktop Auth Section */}
							<div className="flex items-center gap-3">
								{user && (
									<Button
										asChild
										className="bg-amber-600 hover:bg-amber-700 text-white"
									>
										<Link href="/book/upload">
											<Plus className="w-4 h-4 mr-2" />
											Add Book
										</Link>
									</Button>
								)}
								{user ? (
									<NavigationMenu viewport={false}>
										<NavigationMenuList>
											<NavigationMenuItem>
												<NavigationMenuTrigger className="gap-2 hover:cursor-pointer">
													<User className="w-4 h-4" />
													{user.username}
												</NavigationMenuTrigger>
												<NavigationMenuContent>
													<ul className="grid w-60 gap-1 p-2">
														<MenuItem href="/profile">
															<User className="w-4 h-4" />
															<div className="flex flex-col">
																<span className="font-medium">Profile</span>
																<span className="text-xs text-muted-foreground">
																	Manage your account
																</span>
															</div>
														</MenuItem>
														<MenuItem href="/my-books">
															<BookMarked className="w-4 h-4" />
															<div className="flex flex-col">
																<span className="font-medium">My Books</span>
																<span className="text-xs text-muted-foreground">
																	View your collection
																</span>
															</div>
														</MenuItem>
														{user.is_superuser && (
															<>
																<li className="border-t my-1"></li>
																<MenuItem href="/admin">
																	<Shield className="w-4 h-4" />
																	<div className="flex flex-col">
																		<span className="font-medium">
																			Admin Panel
																		</span>
																		<span className="text-xs text-muted-foreground">
																			Manage users & books
																		</span>
																	</div>
																</MenuItem>
															</>
														)}
														<li className="border-t my-1"></li>
														<MenuItem
															onClick={handleLogout}
															className="text-red-600 hover:cursor-pointer"
														>
															<LogOut className="w-4 h-4" />
															<div className="flex flex-col">
																<span className="font-medium">Logout</span>
																<span className="text-xs text-muted-foreground">
																	Sign out of your account
																</span>
															</div>
														</MenuItem>
													</ul>
												</NavigationMenuContent>
											</NavigationMenuItem>
										</NavigationMenuList>
									</NavigationMenu>
								) : (
									<>
										<Button variant="ghost" asChild>
											<Link href="/login">Login</Link>
										</Button>
										<Button asChild className="bg-amber-700 hover:bg-amber-800">
											<Link href="/register">Register</Link>
										</Button>
									</>
								)}
							</div>
						</>
					)}

					{/* Mobile Menu Button */}
					{isMobile && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</Button>
					)}
				</div>

				{/* Mobile Menu */}
				{isMobile && mobileMenuOpen && (
					<div className="pb-4 space-y-2 animate-in slide-in-from-top fade-in duration-300">
						<Button variant="ghost" asChild className="w-full justify-start">
							<Link href="/" onClick={closeMobileMenu}>
								Home
							</Link>
						</Button>
						<Button variant="ghost" asChild className="w-full justify-start">
							<Link href="/browse" onClick={closeMobileMenu}>
								Browse
							</Link>
						</Button>
						{user && (
							<>
								<Button
									variant="ghost"
									asChild
									className="w-full justify-start"
								>
									<Link href="/my-books" onClick={closeMobileMenu}>
										My Books
									</Link>
								</Button>
								<Button
									asChild
									className="w-full bg-amber-600 hover:bg-amber-700 text-white"
								>
									<Link href="/book/upload" onClick={closeMobileMenu}>
										<Plus className="w-4 h-4 mr-2" />
										Add Book
									</Link>
								</Button>
							</>
						)}

						{user ? (
							<>
								<div className="pt-2 border-t">
									<p className="px-4 py-2 text-sm font-medium text-gray-700">
										Signed in as {user.username}
									</p>
								</div>
								<Button
									variant="ghost"
									asChild
									className="w-full justify-start"
								>
									<Link href="/profile" onClick={closeMobileMenu}>
										<User className="w-4 h-4 mr-2" />
										Profile
									</Link>
								</Button>
								{user.is_superuser && (
									<Button
										variant="ghost"
										asChild
										className="w-full justify-start"
									>
										<Link href="/admin" onClick={closeMobileMenu}>
											<Shield className="w-4 h-4 mr-2" />
											Admin Panel
										</Link>
									</Button>
								)}
								<Button
									variant="ghost"
									onClick={handleLogout}
									className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
								>
									<LogOut className="w-4 h-4 mr-2" />
									Logout
								</Button>
							</>
						) : (
							<>
								<Button
									variant="ghost"
									asChild
									className="w-full justify-start"
								>
									<Link href="/login" onClick={closeMobileMenu}>
										Login
									</Link>
								</Button>
								<Button
									asChild
									className="w-full bg-amber-700 hover:bg-amber-800"
								>
									<Link href="/register" onClick={closeMobileMenu}>
										Register
									</Link>
								</Button>
							</>
						)}
					</div>
				)}
			</div>
		</nav>
	);
}

function MenuItem({
	href,
	children,
	onClick,
	className,
}: {
	href?: string;
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}) {
	const content = (
		<div
			className={cn(
				"flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				className
			)}
		>
			{children}
		</div>
	);

	return (
		<li>
			<NavigationMenuLink asChild>
				{href ? (
					<Link href={href}>{content}</Link>
				) : (
					<button onClick={onClick} className="w-full text-left">
						{content}
					</button>
				)}
			</NavigationMenuLink>
		</li>
	);
}
