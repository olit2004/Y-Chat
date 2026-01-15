import React from 'react'

function Intro() {
  return (
    <div className='flex flex-col justify-center items-center h-screen '>
      <a href="/auth/login">
        <button className='w-40 bg-amber-600 rounded m-2 hover:bg-amber-300'>
            Login
        </button>
        </a>
        <button className='w-40 bg-amber-600 rounded m-2 hover:bg-amber-300'>
             <a href="/auth/signup">signup</a>
        </button>

    </div>
  )
}

export default Intro