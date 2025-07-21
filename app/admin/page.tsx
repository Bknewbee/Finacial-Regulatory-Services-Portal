"use client";

import { useAuth } from "../context/context-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";

import DocumentDashboard from "../components/dashboards/DocumentDashboard";
import EventDashboard from "../components/dashboards/EventDashboard";
import PersonnelDashboard from "../components/dashboards/PersonnelDashboard";
import CheckilstItemDashboard from "../components/dashboards/CheckilstItemDashboard";
import FAQDashboard from "../components/dashboards/FAQDashboard";

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const router = useRouter();
  const [activePage, setActivePage] = useState("document");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="rounded bg-gray-800 px-4 py-1 text-white"
        >
          Logout
        </button>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setActivePage("document")}
          className={`rounded px-3 py-1 ${
            activePage === "document" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Document
        </button>
        <button
          onClick={() => setActivePage("checklist")}
          className={`rounded px-3 py-1 ${
            activePage === "checklist"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Checklist
        </button>
        <button
          onClick={() => setActivePage("event")}
          className={`rounded px-3 py-1 ${
            activePage === "event" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Event
        </button>
        <button
          onClick={() => setActivePage("personel")}
          className={`rounded px-3 py-1 ${
            activePage === "personel" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Personel
        </button>
        <button
          onClick={() => setActivePage("faq")}
          className={`rounded px-3 py-1 ${
            activePage === "faq" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          FAQ
        </button>
      </div>

      <div>
        {activePage === "checklist" && (
          <>
            <CheckilstItemDashboard />
          </>
        )}
        {activePage === "event" && (
          <>
            <EventDashboard />
          </>
        )}
        {activePage === "document" && (
          <>
            <DocumentDashboard />
          </>
        )}
        {activePage === "personel" && (
          <>
            <PersonnelDashboard />
          </>
        )}
        {activePage === "faq" && (
          <>
            <FAQDashboard />
          </>
        )}
      </div>
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </div>
  );
}
