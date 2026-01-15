import React from 'react'
import AuthForm from './AuthForm'

function Login() {
  return (
    <div className=' flex flex-col p-3 mt-10 gap-3'>
         <h1 className='text-4xl text-center text-gray-800 font-sarina'>Login</h1>
         <div className="my-15 mx-5">
         <AuthForm title={'login'}/>
         </div>

    </div>
  )
}

export default Login