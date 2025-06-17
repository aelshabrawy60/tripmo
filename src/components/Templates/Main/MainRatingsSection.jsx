import React from 'react'
import AddComment from './AddComment'
import CommentCard from './CommentCard'

function MainRatingsSection({ratings, tripId}) {
  return (
    <div className='flex gap-5 flex-wrap flex-col-reverse md:flex-row'>
        <div className='flex flex-2 flex-col gap-2 min-w-[300px]'>
            {ratings?.map((rate) => <CommentCard key={rate.id} commentData={rate}/>)}
        </div>
    </div>
  )
}

export default MainRatingsSection