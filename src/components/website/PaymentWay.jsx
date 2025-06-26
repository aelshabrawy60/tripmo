import React from 'react'

function PaymentWay({img}) {
  return (
    <div className='h-[40px] min-w-[60px] md:h-[60px] md:min-w-[80px]'>
        <img src={img} className='w-full h-full'></img>
    </div>
  )
}

export default PaymentWay