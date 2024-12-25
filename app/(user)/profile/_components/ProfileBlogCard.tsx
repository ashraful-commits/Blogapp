"use client";

import { Card } from "@/components/ui/card";
import { timeAgo } from "@/utils/timeAgo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProfileBlogCard = ({ post }) => {
  return (
    <>
      <Card suppressHydrationWarning className="p-4 border mb-3 shadow-md transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer">
        <Link
          href={`/blogs/${post.id}`}
          className="absolute opacity-0 top-0 right-0 left-0 bottom-0"
        />
        <div className="relative mb-4 rounded-2xl">
          <Image
            className="h-48 rounded-2xl w-full object-cover transition-transform duration-300 transform group-hover:scale-105"
            src={post?.imageURL}
            alt={post?.title}
            width={500}
            height={30}
          />

          <a
            className="flex justify-center items-center bg-purple-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
            href="/blog/slug"
            target="_self"
            rel="noopener noreferrer"
          >
            Read article
            <svg
              className="ml-2 w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
        <div className="flex flex-col gap-3 text-start py-3">
          <h3 className="text-xl text-[20px] font-semibold">{post?.title}</h3>
          <p className="text-[14px] line-clamp-2">{post?.description}</p>
        </div>

        <div className="flex justify-between items-center w-full pb-4 mb-auto">
          <div className="flex items-center">
            <div className="flex flex-1">
              <div>
                <p className="text-sm font-semibold text-start"></p>
                <p className="text-sm text-gray-500 text-start"></p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="text-sm flex items-center text-gray-500 ">
              {timeAgo(post.createdAt)}
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ProfileBlogCard;
