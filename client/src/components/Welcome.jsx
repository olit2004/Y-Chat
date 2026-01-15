import React, { useMemo } from "react";

function Welcome() {
  
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });


const messages = [
  "Stop broadcasting your 'single and thriving' story. Your inbox knows the truth. A real conversation is a better distraction than your ex's Instagram.",
  
  "Your friends are probably planning something without you. A simple 'hey' is all it takes to shift from forgotten to included. Be strategic.",
  
  "Forget your single ass by becoming someone's main character for the night. A great chat is the ultimate ego boost. You're not lonely, you're just under-utilized.",
  
  "Your silence isn`t mysterious—its forgettable. Stir the pot with a message that makes them rethink everything.",
  
  "Scrolling won`t save you. One bold DM could flip the script and make you the headline."
];

  const randomMessage = useMemo(
    () => messages[Math.floor(Math.random() * messages.length)],
    []
  );

  return (
    <div className="flex flex-col items-center justify-center w-full  h-full bg-canva  mb from-blue-50 to-white text-gray-800 rounded shadow-inner">
      <h1 className="text-3xl text-text-primary font-bold mb-2">{`${greeting}, User! 👋`}</h1>
      <p className="text-sm text-gray-500 mb-6">{date}</p>
      <div className="max-w-lg text-center bg-white shadow-md rounded-xl px-6 py-4">
        <p className="text-lg font-medium text-gray-700">{randomMessage}</p>
      </div>

      <div className="absolute bottom-6 right-8 text-sm text-gray-400 select-none">
       Y Chat @ {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default Welcome;
