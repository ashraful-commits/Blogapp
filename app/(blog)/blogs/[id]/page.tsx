"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { gql, useMutation, useQuery } from "@apollo/client";
import { createAtFormat } from "@/utils/createdAtFormat";
import Preloader from "@/components/Loader/Preloader";
import Link from "next/link";
import { timeAgo } from "@/utils/timeAgo";
import { CopyMinus, Heart, Loader, Undo } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type User = {
  name: string;
  image: string;
};

type Post = {
  id: string;
  title: string;
  imageURL: string;
  createdAt: number;
  categories: string;
  user: User;
};

const GET_LINK = gql`
  query GetLink($linkId: String!) {
    link(id: $linkId) {
      id
      title
      description
      url
      imageURL
      createdAt
      categories
      user {
        id
        name
        email
        role
      }
      bookmarkedBy {
        id
      }
    }
  }
`;

const GET_ALL_LINKS = gql`
  query Links {
    links {
      id
      title
      imageURL
      createdAt
      categories
      userId
    }
  }
`;

const ADD_TO_BOOKMARK = gql`
  mutation AddToBookmark($userId: String!, $linkId: String!) {
    addToBookmark(userId: $userId, linkId: $linkId) {
      id
    }
  }
`;

const REMOVE_FROM_BOOKMARK = gql`
  mutation RemoveFromBookmark($userId: String!, $linkId: String!) {
    removeFromBookmark(userId: $userId, linkId: $linkId) {
      id
    }
  }
`;

const SinglePost = () => {
  const params = useParams();
  const { id } = params;

  const { data: session } = useSession();
  const { id: loggedInUserId } = session?.user as { id: string };

  const {
    data: allPosts,
    loading: allPostsLoading,
    error: allPostsError,
  } = useQuery(GET_ALL_LINKS);
  const { data, loading, error, refetch } = useQuery(GET_LINK, {
    variables: { linkId: id },
  });

  const [
    addToBookmark,
    { loading: addBookmarkLoader, },
  ] = useMutation(ADD_TO_BOOKMARK);
  const [
    removeFromBookmark,
    { loading: removeBookmarkLoader },
  ] = useMutation(REMOVE_FROM_BOOKMARK);

  const [isBookmarked, setIsBookmarked] = useState(false);

  // Extract post and user details
  const post = data?.link;
  const { user } = post || {};

  // Safely sort posts by timestamp
  const sortedPosts = allPosts?.links
    ? allPosts.links.sort((a, b) => b.createdAt - a.createdAt)
    : [];
  const latestPosts = sortedPosts.slice(0, 3);

  useEffect(() => {
    if (post?.bookmarkedBy?.some((user) => user.id === loggedInUserId)) {
      setIsBookmarked(true);
    } else {
      setIsBookmarked(false);
    }
  }, [user, post, loggedInUserId]);

  // Wait for data to load or show error
  if (loading || allPostsLoading) return <Preloader />;
  if (error || allPostsError)
    return <p>Error: {error?.message || allPostsError?.message}</p>;

  const handleAddToBookmark = async (postId, loggedInUserId) => {
    try {
      await addToBookmark({
        variables: { userId: loggedInUserId, linkId: postId },
      });
      setIsBookmarked(true);
      refetch();
      toast("Post Added to bookmark successfully", {
        action: {
          label: <CopyMinus size={16} />,
          onClick: () => console.log("Minus"),
        },
      });
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add bookmark.");
    }
  };

  const handleRemoveFromBookmark = async (postId, loggedInUserId) => {
    try {
      await removeFromBookmark({
        variables: { userId: loggedInUserId, linkId: postId },
      });
      setIsBookmarked(false);
      refetch();
      toast("Post removed from bookmark", {
        action: {
          label: <CopyMinus size={16} />,
          onClick: () => console.log("Undo Remove"),
        },
      });
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to remove bookmark.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 py-8 dark:bg-slate-900">
        <div className="container relative mx-auto px-4 flex justify-between items-center">
          <div className="absolute right-2 -top-6">
            {!isBookmarked ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (post.id && loggedInUserId) {
                          handleAddToBookmark(post.id, loggedInUserId);
                        } else {
                          console.error("Post ID or User ID is missing!");
                        }
                      }}
                      className="flex items-center text-white text-[12px] rounded py-1 px-2 bg-purple-700"
                    >
                      {addBookmarkLoader ? (
                        <Loader className="inline" size={18} />
                      ) : (
                        <Heart className="inline" size={18} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (post.id && loggedInUserId) {
                          handleRemoveFromBookmark(post.id, loggedInUserId);
                        } else {
                          console.error("Post ID or User ID is missing!");
                        }
                      }}
                      className="flex items-center text-white text-[12px] rounded py-1 px-2 bg-red-700"
                    >
                      {removeBookmarkLoader ? (
                        <Loader className="inline" size={18} />
                      ) : (
                        <Undo className="inline" size={18} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-red-700 text-white">
                    <p>Remove from bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="content">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 dark:text-white">
              {post.title}
            </h1>
            <span className="text-gray-600">
              Published on : {createAtFormat(post.createdAt)}
            </span>
          </div>
          <Link href={`/profile/${user.id}`}>
            <div className="user flex gap-2">
              <div className="pr-3">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  src={post.url}
                  alt={"author-image"}
                  height={300}
                  width={600}
                />
              </div>

              <div className="flex flex-1">
                <div>
                  <p className="text-sm font-semibold text-start">
                    {user.name}
                  </p>
                  <p className="text-md text-gray-500 text-start">
                    Role : {user.role}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="py-4">
        <div className="container mx-0 flex flex-col md:flex-row">
          <div className="w-full md:w-3/4">
            <Image
              src={post.imageURL}
              alt="Blog Featured Image"
              className="mb-8 w-full h-96 object-cover"
              height={500}
              width={1000}
            />
            <div className="py-3">
              <h3 className="text-2xl">{post.title} -</h3>
            </div>
            <div className="prose max-w-none">
              <p>{post.description}</p>
            </div>
          </div>
          <div className="w-full md:w-1/4 pl-4">
            <div className="hidden py-2 xl:col-span-3 lg:col-span-4 md:hidden lg:block">
              <div className="mb-0 space-x-5">
                <button
                  type="button"
                  className="pb-3 text-xs font-bold uppercase border-b-2 dark:border-violet-600"
                >
                  Latest Post
                </button>
              </div>
              <div className="flex flex-col">
                {latestPosts?.map((post: Post) => (
                  <div key={post.id} className="flex px-1 py-4">
                    <Image
                      alt="blog-image"
                      className="flex-shrink-0 object-cover w-20 h-14 rounded-sm mr-4 dark:bg-gray-500"
                      src={post.imageURL}
                      height={100}
                      width={150}
                    />
                    <div className="flex flex-col flex-grow">
                      <Link
                        rel="noopener noreferrer"
                        href={`/blogs/${post.id}`}
                        className="font-serif hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-auto text-xs dark:text-gray-600">
                        ({timeAgo(post.createdAt)})
                        <span
                          rel="noopener noreferrer"
                          className="block dark:text-blue-600 lg:ml-2 lg:inline hover:underline"
                        >
                          {post.categories}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
