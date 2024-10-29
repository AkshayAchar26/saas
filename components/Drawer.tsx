"use client";

import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import ThemeController from "./ThemeController";

export default function Drawer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    {
      name: "Public Videos",
      route: "/home",
      isActive: true,
    },
    {
      name: "My videos",
      route: "/user-videos",
      isActive: isSignedIn,
    },
    {
      name: "Social-Share",
      route: "/social-share",
      isActive: isSignedIn,
    },
    {
      name: "Video-Upload",
      route: "/video-upload",
      isActive: isSignedIn,
    },
  ];

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full">
          {isSignedIn && (
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
          )}
          <div className="mx-2 flex-1 px-2">
            <Link href="/">SAAS</Link>
          </div>

          <div className="flex-none lg:hidden">
            <div className="scale-75 p-4">
              <ThemeController />
            </div>
          </div>

          <div className="hidden flex-none lg:block">
            <div className="flex items-center space-x-4">
              <div className="scale-75">
                <ThemeController />
              </div>
              {/* navbar */}
              <ul className="menu menu-horizontal">
                {navItems.map(
                  (nav) =>
                    nav.isActive && (
                      <li key={nav.route}>
                        <Link href={nav.route}>{nav.name}</Link>
                      </li>
                    )
                )}
              </ul>
            </div>
          </div>

          {/* Conditional Avatar (Only if the user is signed in) */}
          {isSignedIn ? (
            <div className="dropdown dropdown-end ">
              <div
                tabIndex={0}
                role="button"
                className="btn bg-transparent m-1"
              >
                <div className="avatar ml-auto">
                  <div className="w-10 rounded-full">
                    <img src={user.imageUrl} alt="User Avatar" />
                  </div>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <span
                    className="btn btn-outline btn-error"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    Logout
                  </span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex-none">
              <Link href="/sign-in" className="btn btn-outline btn-primary">
                Sign In
              </Link>
            </div>
          )}
        </div>
        {children}
      </div>
      {isSignedIn && (
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content */}
            {navItems.map(
              (nav) =>
                nav.isActive && (
                  <li key={nav.route}>
                    <Link href={nav.route}>{nav.name}</Link>
                  </li>
                )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
