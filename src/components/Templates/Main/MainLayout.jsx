import React from 'react'

function MainLayout(props) {
  return (
    <div className='max-w-[1300px] mx-auto p-2'>
        {props.children}
    </div>
  )
}

export default MainLayout