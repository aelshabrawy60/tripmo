import React from 'react'
import { FaMoneyBill } from 'react-icons/fa'

function RefundRecord({data}) {
  // Function to get status color and Arabic text
  const getStatusInfo = (status) => {
    console.log("status", status)
    switch(status) {
      case 'SUCESS':
        return { color: 'text-yellow-600 bg-yellow-50', text: 'مقبول' }
      case 'SUCCESS':
        return { color: 'text-green-600 bg-green-50', text: 'مقبول' }
      case 'rejected':
        return { color: 'text-red-600 bg-red-50', text: 'مرفوض' }
      case 'completed':
        return { color: 'text-blue-600 bg-blue-50', text: 'مكتمل' }
      default:
        return { color: 'text-gray-600 bg-gray-50', text: 'غير محدد' }
    }
  }

  const statusInfo = getStatusInfo(data?.status)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200" dir="rtl">
      <div className="flex items-center justify-between">
        {/* Book ID Section */}
        <div className="flex items-center gap-4 space-x-reverse space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FaMoneyBill className='text-tripmo-500'/>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">رقم الحجز</p>
            <p className="text-sm font-medium text-gray-900">{data?.book_id || 'غير محدد'}</p>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} border`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      {/* Refund Label */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-600 flex items-center">
          <svg className="w-3 h-3 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          طلب استرداد
        </p>
      </div>
    </div>
  )
}

export default RefundRecord