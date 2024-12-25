'use client'

import React from 'react'
import MyProfile from '../_components/MyProfile';
import { useParams } from 'next/navigation';

const SingleUser = () => {
    
    const params = useParams()
    const { id } = params
  
    console.log("userid", id);
  
    // Handle unauthenticated users
    if (!id) {
      return <p>Error: User not authenticated</p>;
    }
  
    return (
      <>
        <MyProfile userId={id} />
      </>
    );
  
}

export default SingleUser