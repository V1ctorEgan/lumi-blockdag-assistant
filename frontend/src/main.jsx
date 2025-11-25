import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Router} from './routes/Router.jsx'
import {RouterProvider } from 'react-router-dom'

const rootEl = document.getElementById('root');
// add class to higgftde scrollbars visually while keeping scrolling enabled
if (rootEl && !rootEl.classList.contains('no-scrollbar')) {
  rootEl.classList.add('no-scrollbar');
}

createRoot(rootEl).render(
  <StrictMode>
      <RouterProvider router={Router} />
  </StrictMode>,
)
