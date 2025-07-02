import { LocationEdit, MapPin, MoveLeft } from 'lucide-react'
import React from 'react'

function FromTo({from, to}) {

  if(from == to){
    return (
        <div className='flex gap-2 text-sm text-gray-700 items-center'>
            <MapPin size={16}/>
            <div>
                {from}
            </div>
        </div>
    )
  }
  return (
    <div className='flex gap-2 text-sm text-gray-700 items-center'>
        <div>{from}</div>
        <div>
            <MoveLeft size={18}/>
        </div>
        <div>{to}</div>
    </div>
  )
}

export default FromTo