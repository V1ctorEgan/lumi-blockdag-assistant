// import { createBrowserRouter } from 'react-router-dom'
// import App from '../App.jsx'
// import Rootlayout from '../pages/Rootlayout.jsx'
// import Landingpage from '../pages/Landingpage.jsx'

// export const Router = createBrowserRouter([

//     {
//     path: "/",
//     element: <Rootlayout />,
//     children: [
//       { path: "/", element: <Landingpage /> },
   
//     ]
//   },
//     {
//     path: '*',
//     element: <div>404 Not Found</div>
//   }

// ])
import { createBrowserRouter } from "react-router-dom";
import Rootlayout from "../pages/Rootlayout.jsx";
import Landingpage from "../pages/Landingpage.jsx";
import ChatPage from "../pages/ChatPage.jsx";  // ← add this

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    children: [
      { path: "/", element: <Landingpage /> },
      // { path: "/chat", element: <ChatPage /> }, // ← add to router
    ],
  },
  {
    path:'/chat',
    element:<ChatPage/>
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
