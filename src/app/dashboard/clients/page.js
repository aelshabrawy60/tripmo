"use client"
import AddUser from '@/components/Users/AddUser'
import UsersList from '@/components/Users/UsersList'
import { useSharedContext } from '@/context/ShareAut'
import React, { useRef } from 'react'

function Page() {
  const { groupId } = useSharedContext();
  const refreshUsersRef = useRef(null); // ✅ to store refresh function

  const handleUserAdded = () => {
    if (refreshUsersRef.current) {
      refreshUsersRef.current(); // ✅ trigger refresh from AddUser
    }
  };

  const handleRegisterRefresh = (refreshFn) => {
    refreshUsersRef.current = refreshFn; // ✅ called by UsersList
  };

  return (
    <div className='p-4'>
      <AddUser groupId={groupId} onPlayerAdded={handleUserAdded} />
      <UsersList groupId={groupId} refreshUsers={handleRegisterRefresh} />
    </div>
  );
}

export default Page;
