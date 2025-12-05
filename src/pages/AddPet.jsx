import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pets as petsApi } from '../api'
import Toast from '../components/Toast'

export default function AddPet(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', breed:'', species:'', age:'', weight:'' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!form.name || !form.species){ setToast('Nome e espécie são obrigatórios'); return }
    setLoading(true)
    try{
      await petsApi.create({ ...form, age: Number(form.age || 0), weight: Number(form.weight || 0)})
      setToast('Pet cadastrado com sucesso!')
      navigate('/pets')
    }catch(err){
      setToast(err.message || 'Erro ao cadastrar pet')
    }finally{ setLoading(false) }
  }
  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Cadastrar Pet</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome *</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            placeholder="Nome do pet" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Espécie *</label>
          <input 
            name="species" 
            value={form.species} 
            onChange={handleChange} 
            placeholder="Ex: Cão, Gato" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raça</label>
          <input 
            name="breed" 
            value={form.breed} 
            onChange={handleChange} 
            placeholder="Raça do pet" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Idade (anos)</label>
            <input 
              type="number" 
              name="age" 
              value={form.age} 
              onChange={handleChange} 
              placeholder="0" 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (kg)</label>
            <input 
              type="number" 
              step="0.1"
              name="weight" 
              value={form.weight} 
              onChange={handleChange} 
              placeholder="0.0" 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
            />
          </div>
        </div>
        <button 
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
      <Toast message={toast} onClose={()=>setToast(null)} />
    </div>
  )
}