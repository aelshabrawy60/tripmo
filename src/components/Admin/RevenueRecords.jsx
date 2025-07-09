import React from 'react'
import RevenueRecord from './RevenueRecord'

function RevenueRecords({records}) {
  return (
    <div className='flex gap-2 flex-col'>
        {records?.map((record)=> <RevenueRecord key={record.id} data={record}/>)}
    </div>
  )
}

export default RevenueRecords