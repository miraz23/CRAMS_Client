import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { router } from './router/router.jsx'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from "./contexts/AuthProvider/AuthProvider.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={QueryClient}>
      <AuthProvider>
       <RouterProvider router={router} />
      </AuthProvider>
      
    </QueryClientProvider>
    
  </StrictMode>,
)
