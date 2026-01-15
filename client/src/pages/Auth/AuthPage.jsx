import React from 'react'
import logo from '/src/assets/icons/Ychat_Logo.svg'
import { Outlet } from 'react-router-dom'
import Login from './Login'
import SignUP from './SignUP'
function AuthPage() {
  return (
    <>
      <div className='bg-sky-50 min-h-screen w-screen flex p-4'>
        <div className="w-full max-w-4xl mx-auto h-auto md:h-[90%] my-auto flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="w-full md:w-1/2 h-48 md:h-full bg-linear-to-br from-blue-500 to-sky-400 p-6 flex flex-col justify-center">
            <div className='flex gap-4 items-center mb-4 md:absolute md:top-6 md:left-6' >
              <img src={logo} alt="y chat logo" className='w-10 md:w-15' />
              <h2 className='text-white font-bold text-xl md:text-2xl '>Y Chat</h2>
            </div>
            <div className="flex flex-col justify-center text-center md:text-left">
              <h1 className='text-3xl md:text-5xl md:ml-15 text-white font-sarina'> Hello,<br /> Welcome!</h1>
              <h2 className='text-lg md:text-2xl md:ml-10 mt-2 md:mt-5 text-white font-poetsen font-bold'>Speak with purpose.<br className="hidden md:block" /> Chat with Y.</h2>
            </div>

          </div>
          {/* // the foerm area */}
          <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center">
            <Outlet />
          </div>

        </div>

      </div>



    </>
  )
}

export default AuthPage