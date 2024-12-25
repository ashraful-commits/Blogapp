"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import Preloader from "@/components/Loader/Preloader";
import BlogCard from "@/app/_components/BlogCard";

type User = {
  id: string;
  name: string;
  image: string;
  email: string;
  createdAt: string;
  posts: Post[];
}

type Post = {
  id: string;
  title: string;
  description: string;
  url: string;
  imageURL: string;
  createdAt: string;
  categories: string;
  userId: string;
  user: User;
};

const GET_ALL_LINKS = gql`
  query getAllLinks {
    links {
      id
      title
      description
      url
      imageURL
      createdAt
      categories
      userId
      user {
        id
        name
        image
      }
      bookmarkedBy {
        id
        name
      }
    }
  }
`;

const Allblogs = () => {
  const { loading, error, data } = useQuery(GET_ALL_LINKS, {
    pollInterval: 10000, // Refetch every 10 seconds
  });

  if (loading) return <Preloader />;
  if (error) return <p>Error: {error.message}</p>;

  const posts = data?.links || [];

  return (
    <div
      className="relative pt-2 lg:pt-2 min-h-screen"
      suppressHydrationWarning
    >
      <div className="bg-cover w-full flex justify-center items-center">
        <div className="w-full bg-opacity-40 backdrop-filter backdrop-blur-lg">
          <div className="w-12/12 mx-auto rounded-2xl bg-opacity-40 backdrop-filter backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 text-center mx-auto">
              {[...posts].reverse()?.map(( post : Post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allblogs;
