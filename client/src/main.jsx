import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Message from './pages/Message.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import Welcome from './components/Welcome.jsx'
import Intro from './pages/Intro.jsx'
import AuthPage from'./pages/Auth/AuthPage.jsx'
import Login from './pages/Auth/Login.jsx'
import SignUP from './pages/Auth/SignUP.jsx'
const route = createBrowserRouter([
  {
    path:"/intro",
    element:<Intro/>
  },
   {
    path:"Auth",
    element:<AuthPage/>,
    children:[
      {
        index:true,
        element:<Intro/>
      },
      {
        path:'login',
        element:<Login/>
      },
      {
        path:'SignUp',
        element:<SignUP/>
      },

    ]

  },
  {
    path: "/",
    element: <App />,
    children: [
        {
            index:true,
            element:<Welcome/>
          },
      {
        path: "message",
        element: <Message />,
        children: [
          {
            index:true,
            element:<Welcome/>
          },
          {
            path: "chat/:id",
            element: <ChatWindow/>,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={route} />

  </StrictMode>,
)
