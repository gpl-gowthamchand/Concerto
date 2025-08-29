'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    notifications: boolean
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  updatePreferences: (preferences: Partial<User['preferences']>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    setMounted(true)
    
    const checkAuth = async () => {
      try {
        // Check localStorage for existing token
        const token = localStorage.getItem('concerto_token')
        if (token) {
          // In a real app, validate token with backend
          const savedUser = localStorage.getItem('concerto_user')
          if (savedUser) {
            setUser(JSON.parse(savedUser))
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted) {
      checkAuth()
    }
  }, [mounted])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication - in real app, call backend API
      if (email === 'demo@concerto.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          username: 'demo_user',
          email: 'demo@concerto.com',
          avatar: '/api/placeholder/100/100',
          preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true
          }
        }
        
        setUser(mockUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('concerto_token', 'mock_jwt_token')
          localStorage.setItem('concerto_user', JSON.stringify(mockUser))
        }
        return true
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock signup - in real app, call backend API
      const mockUser: User = {
        id: Date.now().toString(),
        username,
        email,
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true
        }
      }
      
      setUser(mockUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('concerto_token', 'mock_jwt_token')
        localStorage.setItem('concerto_user', JSON.stringify(mockUser))
      }
      return true
    } catch (error) {
      console.error('Signup failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('concerto_token')
      localStorage.removeItem('concerto_user')
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('concerto_user', JSON.stringify(updatedUser))
      }
    }
  }

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('concerto_user', JSON.stringify(updatedUser))
      }
    }
  }

  // Prevent hydration mismatch by not rendering auth state until mounted
  if (!mounted) {
    return (
      <AuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: async () => false,
        signup: async () => false,
        logout: () => {},
        updateUser: () => {},
        updatePreferences: () => {}
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    updatePreferences
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
