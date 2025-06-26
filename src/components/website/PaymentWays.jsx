import React from 'react'
import PaymentWay from './PaymentWay'


const ways = ['/visa.png', '/mastercard.png', '/vf-cash.png', '/instapay.png']

function PaymentWays() {
  return (
    <div className='flex gap-20 justify-around items-center flex-wrap'>
        {ways.map((way, index)=> <PaymentWay key={index} img={way}/>)}
    </div>
  )
}

export default PaymentWays