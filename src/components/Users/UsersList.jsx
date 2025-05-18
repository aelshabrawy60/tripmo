import React, { useEffect, useState } from 'react'
import UserCard from './UserCard'
import { Loader, RefreshCw, Search, Users, AlertCircle, X } from 'lucide-react'
import AddUser from './AddUser'

function UsersList({ groupId, refreshUsers }) {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const fetchUsers = async (showRefreshAnimation = false) => {
    try {
      if (showRefreshAnimation) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const response = await fetch(`/api/dashboard/users?groupId=${groupId}`)
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`)
      }
      
      const data = await response.json()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [groupId])

  useEffect(() => {
    if (refreshUsers) {
      refreshUsers(() => fetchUsers(true))
    }
  }, [refreshUsers])

  const handleRefresh = () => {
    fetchUsers(true)
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const clearSearch = () => {
    setSearchTerm('')
  }

  // Skeleton loader for the loading state
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5 mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Header with search and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className='flex items-center w-full sm:w-auto'>
            <AddUser groupId={groupId} onPlayerAdded={handleRefresh} />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث عن مستخدم..."
              className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              dir="rtl"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing || isLoading}
            className={`p-2 rounded-lg border border-gray-200 ${isRefreshing ? 'bg-blue-50' : 'hover:bg-gray-100'} transition-colors`}
            title="تحديث"
          >
            <RefreshCw size={18} className={`text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}

      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-medium mb-1">حدث خطأ أثناء تحميل المستخدمين</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-3 text-sm bg-white border border-red-300 text-red-700 px-4 py-1.5 rounded-md hover:bg-red-50 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && users.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Users size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">لا يوجد مستخدمين</h3>
          <p className="text-gray-500 mb-4">لم يتم العثور على أي مستخدمين في هذه المجموعة</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            تحديث القائمة
          </button>
        </div>
      )}

      {/* Search with no results */}
      {!isLoading && !error && users.length > 0 && filteredUsers.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Search size={36} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">لا توجد نتائج بحث</h3>
          <p className="text-gray-500 mb-3">لم يتم العثور على أي مستخدمين مطابقين لـ "{searchTerm}"</p>
          <button 
            onClick={clearSearch}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            مسح البحث
          </button>
        </div>
      )}

      {/* Users list/grid */}
      {!isLoading && !error && filteredUsers.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} data={user} onDelete={handleRefresh} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        {user.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Here you can add action buttons, or render what you need from the UserCard component */}
                    <button 
                      onClick={() => handleRefresh()}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UsersList