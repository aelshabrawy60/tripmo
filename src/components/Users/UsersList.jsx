import React, { useEffect, useState } from 'react'
import UserCard from './UserCard'
import { Loader } from 'lucide-react'

function UsersList({groupId, refreshUsers}) {
  const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)


    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/dashboard/users?groupId=${groupId}`)
            
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`)
            }
            
            const data = await response.json()
            setUsers(data.users || [])
            setIsLoading(false)
        } catch (err) {
            console.error('Error fetching users:', err)
            setError(err.message)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }
    , [groupId])

    function handleRefresh() {
        fetchUsers()
    }

    useEffect(() => {
        if (refreshUsers) {
          refreshUsers(handleRefresh); // ✅ pass function to parent
        }
      }, []);
      

  return (
    <div >
        {isLoading && (
            <div className="flex justify-center items-center p-12">
                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="mr-3 text-lg text-gray-700">جاري التحميل...</span>
            </div>
        )}

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>Error loading users: {error}</p>
                <p>Please check your connection and try again.</p>
            </div>
        )}


        {users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map((user) => (
                    <UserCard key={user.id} data={user} onDelete={handleRefresh}/>
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-500">لا يوجد مستخدمين</div>
        )}
    </div>
  )
}

export default UsersList