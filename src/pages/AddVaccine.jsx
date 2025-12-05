import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { pets as petsApi } from '../api'
import Toast from '../components/Toast'

export default function AddVaccine(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', date:'', nextDate:'', lot:'', vet:'' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!form.name || !form.date){ setToast('Nome e data são obrigatórios'); return }
    setLoading(true)
    try{
      await petsApi.addVaccine(id, { name: form.name, date: form.date, next: form.nextDate, lot: form.lot, vet: form.vet })
      setToast('Vacina adicionada')
      navigate(`/pets/${id}`)
    }catch(err){
      setToast(err.message || 'Erro ao adicionar vacina')
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Adicionar Vacina</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da vacina *</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            placeholder="Ex: V10, Antirrábica" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data da aplicação *</label>
          <input 
            required 
            name="date" 
            value={form.date} 
            onChange={handleChange} 
            type="date" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Próxima dose</label>
          <input 
            name="nextDate" 
            value={form.nextDate} 
            onChange={handleChange} 
            type="date" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lote (opcional)</label>
          <input 
            name="lot" 
            value={form.lot} 
            onChange={handleChange} 
            placeholder="Número do lote" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Veterinário (opcional)</label>
          <input 
            name="vet" 
            value={form.vet} 
            onChange={handleChange} 
            placeholder="Nome do veterinário" 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
          />
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