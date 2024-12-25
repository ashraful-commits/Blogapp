"use client";

import Image from "next/image";
import React from "react";
import profileBG from "../../../../assets/profilebg.jpg";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { createdAtByUseer } from "@/utils/createdAtFormat";
import { timeAgo } from "@/utils/timeAgo";
import ProfileBlogCard from "./ProfileBlogCard";
import Preloader from "@/components/Loader/Preloader";

const LOGIN_USER = gql`
  query GET_USER($id: String!) {
    user(id: $id) {
      id
      email
      name
      image
      createdAt
      role
      links {
        id
        title
        description
        imageURL
        createdAt
      }
      bookmarks {
        id
      }
    }
  }
`;

const MyProfile = ({ userId }) => {
  const { loading, data, error } = useQuery(LOGIN_USER, {
    variables: { id: userId },
  });

  if (loading) return <Preloader />;
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const user = data?.user;
  const { links } = user;

  if (!user) {
    return <p>No user found</p>;
  }

  return (
    <>
      <div className="h-full">
        <div className=" rounded-lg shadow-xl pb-8">
          <div
            x-data="{ openSettings: false }"
            className="absolute right-12 mt-4 rounded"
          >
            <div
              x-show="openSettings"
              className=" absolute right-0 w-40 py-2 mt-1 border border-gray-200 shadow-2xl"
              style={{ display: "none" }}
            >
              <div className="py-2 border-b">
                <p className="text-gray-400 text-xs px-6 uppercase mb-1">
                  Settings
                </p>
                <button className="w-full flex items-center px-6 py-1.5 space-x-2 hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">Share Profile</span>
                </button>
                <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">Block User</span>
                </button>
                <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">More Info</span>
                </button>
              </div>
              <div className="py-2">
                <p className="text-gray-400 text-xs px-6 uppercase mb-1">
                  Feedback
                </p>
                <button className="w-full flex items-center py-1.5 px-6 space-x-2 hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">Report</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full h-[250px]">
            <Image
              src={profileBG}
              className="w-full h-full rounded-tl-lg rounded-tr-lg"
              alt="profile-image"
            />
          </div>
          <div className="flex flex-col items-center -mt-20">
            <Image
              src={user.image || "https://static.vecteezy.com/system/resources/previews/016/058/540/non_2x/icon-person-design-and-line-art-icon-free-vector.jpg"}
              className="w-40 h-auto border-4 border-white rounded-full"
              alt="profile-image"
              height={40}
              width={500}
            />
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-2xl">{user.name}</p>
              <span className="bg-blue-500 rounded-full p-1" title="Verified">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-100 h-2.5 w-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            </div>
            {/* <p className="text-gray-700">
              Senior Software Engineer at Tailwind CSS
            </p>
            <p className="text-sm text-gray-500">New York, USA</p> */}
          </div>
        </div>
        <div className="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
          <div className="w-full flex flex-col 2xl:w-1/3">
            <div className="flex-1 rounded-lg shadow-xl p-8">
              <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
              <ul className="mt-2 text-gray-700">
                <li className="flex border-y py-2">
                  <span className="font-bold w-24">Full name:</span>
                  <span className="text-gray-700">{user.name}</span>
                </li>

                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Email:</span>
                  <span className="text-gray-700">{user.email}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Role:</span>
                  <span className="text-gray-700">{user.role}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Posted:</span>
                  <span className="text-gray-700 font-semibold">
                    {user.links ? user.links.length : 0}
                  </span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Joined:</span>
                  <span className="text-gray-700">
                    {createdAtByUseer(user.createdAt)} (
                    {timeAgo(user.createdAt)})
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col w-full 2xl:w-2/3">
            <div className="flex-1 rounded-lg shadow-xl p-8">
              <h4 className="text-xl text-gray-900 font-bold">Posted Blogs </h4>
              <div className="w-full mt-4 bg-opacity-40 backdrop-filter backdrop-blur-lg">
                <div className="w-12/12 mx-auto rounded-2xl bg-opacity-40 backdrop-filter backdrop-blur-lg">
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 text-center mx-auto">
                    {links?.map((post) => (
                      <ProfileBlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              </div>
              {/* <div className="mt-4">
          <canvas id="verticalBarChart" style={{display: 'block', boxSizing: 'border-box', height: 414, width: 828}} width={1656} height={828} />
        </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
