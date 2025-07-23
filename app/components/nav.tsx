"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

function Nav() {
  const { user, logout } = useAuth();

  // async function logout() {
  //   await fetch("/api/auth/logout", { method: "POST" });
  //   window.location.href = "/";
  // }

  return (
    <div className="flex w-full justify-end px-4 py-2">
      {user ? (
        <>
          <Link
            href="/"
            className="me-2 mb-1 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 hover:underline"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="me-2 mb-1 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 hover:underline"
          >
            Dashboard
          </Link>
          <span className="me-2 mb-1 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900">
            {user?.name}
          </span>
          <button
            className="me-2 mb-1 rounded-lg border border-gray-200 bg-white px-5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none"
            onClick={() => {
              logout();
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link
            href="/"
            className="me-2 mb-1 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-900 hover:underline"
          >
            Home
          </Link>
          <a
            className="me-2 mb-1 rounded-lg border border-gray-200 bg-white px-5 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 focus:outline-none"
            href="/login"
          >
            Login
          </a>
        </>
      )}
    </div>
  );
}

export default Nav;
