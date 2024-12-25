"use client";

import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import UserTable from "./_components/UserTable";
import Preloader from "@/components/Loader/Preloader";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";


// GraphQL query
const GET_ALL_USER = gql`
  query Users {
    users {
      id
      email
      name
      image
      createdAt
      role
    }
  }
`;

const AllUsers = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USER);

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
  const users = data?.users || [];

  return <UserTable data={users} refetch={refetch} />;
};

export default AllUsers;
