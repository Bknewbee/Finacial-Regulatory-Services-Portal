"use client";
import React from "react";
import { usePathname } from "next/navigation";

function Nav() {
  const path = usePathname();
  return (
    <div className="flex w-full justify-end px-4 py-2">
      {path === "/admin" ? null : <a href="/admin">Login</a>}
    </div>
  );
}

export default Nav;
