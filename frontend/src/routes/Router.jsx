import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Rootlayout from '../pages/Rootlayout.jsx'
import Landingpage from '../pages/Landingpage.jsx'

export const Router = createBrowserRouter([

    {
    path: "/",
    element: <Rootlayout />,
    children: [
      { path: "/", element: <Landingpage /> },
   
    ]
  },
    {
    path: '*',
    element: <div>404 Not Found</div>
  }

])
