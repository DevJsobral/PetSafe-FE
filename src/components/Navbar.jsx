import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getUser as getStoredUser, auth } from '../api'

export default function Navbar(){
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [dark, setDark] = useState(false)

  // Atualizar usuário sempre que a rota mudar
  useEffect(()=>{
    setUser(getStoredUser())
  }, [location])

  useEffect(()=>{
    const d = localStorage.getItem('petsafe_dark') === '1'
    setDark(d)
    // Aplicar no HTML element
    if(d) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },[])

  const toggleDark = () => {
    const nd = !dark
    setDark(nd)
    localStorage.setItem('petsafe_dark', nd ? '1' : '0')
    
    // Aplicar no HTML element
    if(nd) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = () => {
    // Usa a função de logout da API
    auth.logout()
    
    // Atualizar estado local
    setUser(null)
    
    // Redirecionar para login
    navigate('/login')
  }
  
  return (
    <nav className="bg-white dark:bg-black shadow-sm dark:shadow-lg border-b border-gray-200 dark:border-gray-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 dark:from-teal-400 dark:to-teal-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            🐾 PetSafe
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            to="/pets" 
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors font-medium"
          >
            Meus Pets
          </Link>
          <Link 
            to="/pets/add" 
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors font-medium"
          >
            Cadastrar Pet
          </Link>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-lg border border-teal-200 dark:border-teal-800">
                <span className="text-lg">👤</span>
                <span className="font-semibold">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              Entrar
            </Link>
          )}
          
          <button 
            onClick={toggleDark} 
            aria-label="Toggle dark mode" 
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-2xl"
          >
            {dark ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  )
}