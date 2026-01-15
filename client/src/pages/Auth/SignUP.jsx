import React from 'react'
import AuthForm from './AuthForm'

function SignUP() {
  return (
    <div>

    <div className=' flex flex-col p-3 gap-3'>
         <h1 className='text-4xl text-center text-gray-800 font-sarina'>Signup</h1>
         <div className="my-7 mx-5">
     <AuthForm title={'signup'}/>

         </div>

    </div>
    </div>
  )
}

export default SignUP