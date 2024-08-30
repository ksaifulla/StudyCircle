import { useState } from "react";

export default function CopyLink({ groupId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(groupId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <div className="relative">
      <input type="hidden" id="hs-clipboard-tooltip" value={groupId} />

      <button
        type="button"
        onClick={handleCopy}
        className="relative py-1 px-2 inline-flex justify-center items-center gap-x-2 text-sm font-mono rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
      >
        {groupId}
        <span className="border-s pl-3.5">
          {copied ? (
            <svg
              className="size-4 text-blue-600 rotate-6 transition"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg
              className="size-4 transition group-hover:rotate-6"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            </svg>
          )}
        </span>

        <span
          className={`absolute z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-lg shadow-sm transition-opacity duration-300 ${
            copied ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          role="tooltip"
        >
          Copied
        </span>
      </button>
    </div>
  );
}
