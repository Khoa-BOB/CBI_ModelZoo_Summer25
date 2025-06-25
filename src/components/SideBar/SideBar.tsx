'use client'

import NextLink, {LinkProps as NextLinkProps} from "next/link";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Image from "next/image"
import { ReactNode } from "react";

import { RocketIcon, LayersIcon, BackpackIcon, HomeIcon, ReaderIcon } from "@radix-ui/react-icons";



interface NavLinkProps extends Omit<NextLinkProps, 'href'> {
  href: string;
  children: ReactNode;
  className?: string;
}

export const Link: React.FC<NavLinkProps> = ({//Destruct
  href,
  children,
  className = '',
  ...nextLinkProps
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // merge in an "active" utility class when needed
  const combined = [
    // base pill
    "flex items-center justify-center p-3 rounded-lg transition-all",
    // active vs inactive
    isActive
      ? "bg-gray-900 text-white"
      : "text-gray-500 hover:bg-gray-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");


  return (
    <NavigationMenu.Link asChild>
      <NextLink
        href={href}
        className={combined}
        {...nextLinkProps}
      >
        {children}
      </NextLink>
    </NavigationMenu.Link>
  );
};

//fixed inset-y-0 left-0
export default function SideBar() {
  return (
    <NavigationMenu.Root
      orientation="vertical"
      className={`
        group           
        flex-none
        w-20
        hover:w-56         
        transition-all duration-300 ease-out
        bg-white shadow-lg
        rounded-tr-3xl rounded-br-3xl
        flex flex-col items-center
        py-6
        group-hover:items-start
        group-hover:px-4
        overflow-hidden
        items-start
      `}
    >
      <NavigationMenu.List className="flex flex-col gap-2 w-full">
        {([
          ["/dashboard", HomeIcon, "Dashboard"],
          ["/models", RocketIcon,  "Model"],
          ["/datasets", LayersIcon, "Dataset"],
          ["/notebooks", ReaderIcon, "Notebooks"],
          ["/applications", BackpackIcon, "Applications"],
        ] as const).map(([href, Icon, label]) => (
          <NavigationMenu.Item key={href}>
            <Link href={href} className="w-full">
              <div className="flex items-center w-full">
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span className ="
                  hidden
                  group-hover:inline-block
                  ml-3 
                  whitespace-nowrap
                  opacity-0 
                  group-hover:opacity-100
                  transition-opacity duration-300">
                  {label}
                </span>
              </div>
            </Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
}