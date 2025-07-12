import React from 'react'
import PaymentWay from './PaymentWay'


const ways = ['/visa.png', '/mastercard.png', '/vf-cash.png', '/instapay.png']

function PaymentWays({type = 0}) {
  if (type === 1) {
    return (
      <div className='flex gap-8 justify-around items-center flex-wrap'>
        {ways.map((way, index) => <PaymentWay key={index} img={way} type={type}/>)}
      </div>
    )
  }
  return (
    <div className='flex gap-20 justify-around items-center flex-wrap'>
        {ways.map((way, index)=> <PaymentWay key={index} img={way}/>)}
    </div>
  )
}

export default PaymentWays