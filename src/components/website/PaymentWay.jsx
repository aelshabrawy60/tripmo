import React from 'react'

function PaymentWay({img, type = 0}) {

  if(type == 1){
    return (
      <div className='h-[30px] min-w-[40px] md:h-[40px] md:min-w-[60px]'>
          <img src={img} className='w-full h-full' alt='Payment Method Icon'></img>
      </div>
    )
  }
  return (
    <div className='h-[40px] min-w-[60px] md:h-[60px] md:min-w-[80px]'>
        <img src={img} className='w-full h-full' alt='Payment Method Icon'></img>
    </div>
  )
}

export default PaymentWay