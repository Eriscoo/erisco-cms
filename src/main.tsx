import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from './locales'
import { RouterProvider } from './utils/router'
import './assets/css/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </RouterProvider>
  </StrictMode>,
)
