"use client";

import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import Preloader from "@/components/Loader/Preloader";
import PostTable from "./_components/PostTable";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";

// GraphQL query
const GET_ALL_LINKS = gql`
  query Links {
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
        name
        image
      }
    }
  }
`;

const Page = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_LINKS);

  const { data: session } = useSession();
  const role = session?.user?.role || "";

  useEffect(() => {
    if (role === "USER") {
      redirect("/blogs");
    }
  });

  // Handle loading and error states
  if (loading) return <Preloader />;
  if (error) return <p>Error: {error.message}</p>;

  // Safely access users
  const posts = data?.links || [];

  return <PostTable data={posts} refetch={refetch} />;
};

export default Page;
