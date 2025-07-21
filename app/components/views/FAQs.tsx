"use client";
import React, { useState } from "react";
import FAQChatbot from "../faqChatBot";

function FAQs() {
  const [isOpen, setIsOpen] = useState(false);
  return isOpen ? (
    <div className="fixed right-6 bottom-6 z-50 w-[450px]">
      <div className="relative rounded-lg bg-white p-2 text-center shadow">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="absolute top-2 right-2 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-toggle="deleteModal"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <div className="mt-2 overflow-y-auto">
          <FAQChatbot />
        </div>
      </div>
    </div>
  ) : (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="fixed right-6 bottom-6 rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700"
    >
      Ask
    </button>
  );
}

export default FAQs;
