'use client'

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  RocketIcon,
  LayersIcon,
  BackpackIcon,
  HomeIcon,
  ReaderIcon,
  SunIcon,
  MoonIcon,
} from "@radix-ui/react-icons";

interface NavLinkProps extends Omit<NextLinkProps, 'href'> {
  href: string;
  children: ReactNode;
  className?: string;
}

const Link: React.FC<NavLinkProps> = ({
  href,
  children,
  className = '',
  ...nextLinkProps
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const combined = [
    "flex items-center justify-center p-3 rounded-lg transition-all",
    isActive
      ? "bg-gray-900 text-white"
      : "text-gray-500 hover:bg-gray-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <NavigationMenu.Link asChild>
      <NextLink href={href} className={combined} {...nextLinkProps}>
        {children}
      </NextLink>
    </NavigationMenu.Link>
  );
};

export default function SideBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NavigationMenu.Root
      orientation="vertical"
      className={`
        group flex-none w-20 hover:w-56 transition-all duration-300 ease-out
        bg-gray-900 dark:bg-gray-900 shadow-lg rounded-tr-3xl rounded-br-3xl
        flex flex-col items-center py-6 group-hover:items-start group-hover:px-4
        overflow-hidden
      `}
    >
      <NavigationMenu.List className="flex flex-col gap-2 w-full">
        {([
          ["/dashboard", HomeIcon, "Dashboard"],
          ["/models", RocketIcon,  "Models"],
          ["/datasets", LayersIcon, "Datasets"],
          ["/notebooks", ReaderIcon, "Notebooks"],
          ["/applications", BackpackIcon, "Applications"],
        ] as const).map(([href, Icon, label]) => (
          <NavigationMenu.Item key={href}>
            <Link href={href} className="w-full">
              <div className="flex items-center w-full">
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span
                  className="
                    hidden group-hover:inline-block ml-3 whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    text-gray-100 dark:text-gray-100
                  "
                >
                  {label}
                </span>
              </div>
            </Link>
          </NavigationMenu.Item>
        ))}

        {/* ——— Theme Toggle ——— */}
        {mounted && (
          <NavigationMenu.Item className="mt-auto w-full">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="
                flex items-center w-full p-3 rounded-lg transition-colors
                text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800
              "
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === 'dark' ? (
                <SunIcon className="w-6 h-6 flex-shrink-0" />
              ) : (
                <MoonIcon className="w-6 h-6 flex-shrink-0" />
              )}
              <span
                className="
                  hidden group-hover:inline-block ml-3 whitespace-nowrap
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  text-gray-100 dark:text-gray-100
                "
              >
                {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </NavigationMenu.Item>
        )}
      </NavigationMenu.List>

      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
}
