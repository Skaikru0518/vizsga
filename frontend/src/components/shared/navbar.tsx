"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import { useIsMobile } from "@/hooks";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const profileLinks: { title: string; href: string; description: string }[] = [
	{
		title: "Manage",
		href: "/#",
		description: "",
	},
];

export default function Navbar() {
	const isMobile = useIsMobile();

	return (
		<NavigationMenu viewport={isMobile}>
			<NavigationMenuList className="flex-wrap">
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<Link href={"/"}>Home</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>My Profile</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-2 sm:w-100 md:w-125 md:grid-cols-1 lg:w-150">
							{profileLinks.map((component) => (
								<ListItem
									key={component.title}
									title={component.title}
									href={component.href}
								>
									{component.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<Link href="/docs">Docs</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className="hidden md:block">
					<NavigationMenuTrigger>List</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[300px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link href="#">
										<div className="font-medium">Components</div>
										<div className="text-muted-foreground">
											Browse all components in the library.
										</div>
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href="#">
										<div className="font-medium">Documentation</div>
										<div className="text-muted-foreground">
											Learn how to use the library.
										</div>
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href="#">
										<div className="font-medium">Blog</div>
										<div className="text-muted-foreground">
											Read our latest blog posts.
										</div>
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem className="hidden md:block">
					<NavigationMenuTrigger>Simple</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link href="#">Components</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href="#">Documentation</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href="#">Blocks</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem className="hidden md:block">
					<NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[200px] gap-4">
							<li>
								<NavigationMenuLink asChild>
									<Link href="#" className="flex-row items-center gap-2">
										<CircleHelpIcon />
										Backlog
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href="#" className="flex-row items-center gap-2">
										<CircleIcon />
										To Do
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href="#" className="flex-row items-center gap-2">
										<CircleCheckIcon />
										Done
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}
