"use client";
import Link from "next/link";
import React from "react";

const Notfound = () => {
  return (
    <section className="bg-white dark:bg-gray-900 h-full flex items-center justify-center">
      <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Something&#39;s missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can&#39;t find that page. You&#39;ll find lots to explore
            on the home page.
          </p>
          <Link href="/"
            className="inline-flex cursor-pointer items-center justify-center text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-700 dark:hover:bg-purple-800 dark:focus:ring-purple-900 my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Notfound;
