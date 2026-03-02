"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const placeholders = ["Onion Makhana", "Apple", "Cashew Anardana"];

export default function AnimatedSearchBar() {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="animated-search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <input
          id="animated-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder=""
          className="h-12 w-full rounded-xl border border-zinc-300 bg-white pl-4 pr-12 text-sm text-zinc-900 outline-none ring-red-500 transition focus:ring-2"
        />

        {query.length === 0 ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 pr-12 text-sm text-zinc-400">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholders[placeholderIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: "easeInOut" }}
                className="whitespace-nowrap"
              >
                {placeholders[placeholderIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        ) : null}

        <button
          type="button"
          aria-label="Search"
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-zinc-500 transition hover:text-zinc-700"
        >
          <Image src="/icons/search.svg" alt="" width={18} height={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
