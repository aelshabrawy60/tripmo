import { LocationEdit, MapPin, MoveLeft, MoveRight } from 'lucide-react'
import React from 'react'

function FromTo({from, to, locale}) {

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
            {locale == "en"? <MoveRight size={18}/> : <MoveLeft size={18}/>}
            
        </div>
        <div>{to}</div>
    </div>
  )
}

export default FromTo