import React, { useState } from 'react'
import send from '../assets/icons/send.svg'
import emoji from '../assets/icons/emoji.svg'



function MessageInput({ handleSend, sender }) {

  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(text);
    setText("");
  }
  return (
    <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 flex h-14 md:h-15 justify-between bg-message-input" action="">
      <input
        type="text"
        placeholder="Type a message..."
        className="grow px-3 md:px-4 py-2 rounded-md focus:outline-none text-sm text-text-primary md:text-base"
        value={text}
        onChange={(e) => setText(e.target.value)} />

      <div className='flex gap-3 md:gap-6 flex-row items-center mx-2'>
        <img src={emoji} alt="emoji"
          className='w-8 h-8 md:w-10 md:h-10 hover:scale-110 hover:opacity-80 transition-transform' />

        <button type='submit' className=' cursor-pointer'>
          <img src={send} alt="send "

            className='w-8 h-8 md:w-10 md:h-10 hover:scale-110 hover:opacity-80 transition-transform' /></button>
      </div>
    </form>


  )
}

export default MessageInput