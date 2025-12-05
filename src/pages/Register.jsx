import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../api'
import Toast from '../components/Toast'

export default function Register(){
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!name || !email || !password){ setToast('Preencha todos os campos'); return }
    if(password.length < 6){ setToast('Senha deve ter pelo menos 6 caracteres'); return }
    setLoading(true)
    try{
      await auth.register({ name, email, password })
      setToast('Conta criada com sucesso')
      navigate('/dashboard')
    }catch(err){
      setToast(err.message || 'Erro no cadastro')
    }finally{ setLoading(false) }
  }
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Cadastro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
          <input 
            required 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            type="text" 
            placeholder="Seu nome completo" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input 
            required 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            type="email" 
            placeholder="seu@email.com" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
          <input 
            required 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            type="password" 
            placeholder="Mínimo 6 caracteres" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          {loading ? 'Criando...' : 'Cadastrar'}
        </button>
      </form>
      <Toast message={toast} onClose={()=>setToast(null)} />
    </div>
  )
}