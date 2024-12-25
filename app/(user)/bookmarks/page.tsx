"use client";

import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import Preloader from "@/components/Loader/Preloader";
import { useSession } from "next-auth/react";
import BookmarkTable from "./_components/BookmarkTable";

const LOGGED_IN_USER = gql`
  query User($userId: String!) {
    user(id: $userId) {
      bookmarks {
        id
        title
        description
        imageURL
        createdAt
        categories
        userId
      }
    }
  }
`;

const Bookmarks = () => {
  const { data: session } = useSession();
  const id: string | undefined = session?.user?.id;

  const { data, loading, error } = useQuery(LOGGED_IN_USER, {
    variables: { userId: id },
  });

  if (loading) return <Preloader />;
  if (error) return <p>{error.message}</p>;

  const { user } = data;
  const { bookmarks } = user;

  return (
    <div
      className="relative pt-2 lg:pt-2 min-h-screen"
      suppressHydrationWarning
    >
      <div className="bg-cover w-full flex justify-center items-center">
        <div className="w-full bg-opacity-40 backdrop-filter backdrop-blur-lg">
          <div className="w-12/12 mx-auto rounded-2xl bg-opacity-40 backdrop-filter backdrop-blur-lg">
            <h2 className="font-manrope text-4xl font-bold text-gray-900 text-center mb-8">
              My Bookmarked
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-5 text-center mx-auto">
              {bookmarks?.map((post) => (
                <BookmarkTable post={post} key={post.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
