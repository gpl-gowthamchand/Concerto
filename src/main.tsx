import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// Initialize theme
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('user-storage');
  if (savedTheme) {
    try {
      const userData = JSON.parse(savedTheme);
      if (userData.user?.preferences?.theme) {
        document.documentElement.setAttribute('data-theme', userData.user.preferences.theme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (error) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
};

// Apply theme before rendering
initializeTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
