import React from "react";
import { getServerSession } from "next-auth";
import MyProfile from "./_components/MyProfile";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";



const Profile = async () => {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Handle unauthenticated users
  if (!userId) {
    return <p>Error: User not authenticated</p>;
  }

  return (
    <>
      <MyProfile userId={userId} />
    </>
  );
};

export default Profile;
