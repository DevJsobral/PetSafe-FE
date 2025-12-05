import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { pets as petsApi, getUser } from '../api'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import QRCodeGenerator from '../components/QRCodeGenerator'

function WeightChart({ weights }) {
  const [hoveredPoint, setHoveredPoint] = React.useState(null)
  
  if(!weights || weights.length === 0) return (
    <div className="text-center py-8">
      <div className="text-6xl mb-3">📊</div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Sem registros de peso.</p>
    </div>
  )
  
  const points = weights.slice().sort((a,b)=> new Date(a.date) - new Date(b.date))
  const maxW = Math.max(...points.map(p=>p.weight))
  const minW = Math.min(...points.map(p=>p.weight))
  const pad = 40
  const width = 600, height = 200
  const mapX = (i) => pad + (i/(points.length-1 || 1))*(width-2*pad)
  const mapY = (w) => pad + (1 - (w - minW)/(maxW - minW || 1))*(height-2*pad)
  const path = points.map((p,i)=> `${i===0 ? 'M' : 'L'} ${mapX(i)} ${mapY(p.weight)}`).join(' ')
  
  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/10 dark:to-blue-900/10 rounded-xl p-4 relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line 
            key={i} 
            x1={pad} 
            y1={pad + i*(height-2*pad)/4} 
            x2={width-pad} 
            y2={pad + i*(height-2*pad)/4} 
            stroke="currentColor" 
            strokeWidth="1" 
            opacity="0.1"
            className="text-gray-400"
          />
        ))}
        
        {/* Area fill */}
        <path 
          d={`${path} L ${width-pad} ${height-pad} L ${pad} ${height-pad} Z`}
          fill="url(#gradient)" 
          opacity="0.3"
        />
        
        {/* Line */}
        <path d={path} fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Points with hover */}
        {points.map((p,i)=> (
          <g 
            key={p.id}
            onMouseEnter={() => setHoveredPoint(i)}
            onMouseLeave={() => setHoveredPoint(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle 
              cx={mapX(i)} 
              cy={mapY(p.weight)} 
              r={hoveredPoint === i ? "7" : "5"} 
              fill="#14b8a6" 
              className="transition-all"
            />
            <circle 
              cx={mapX(i)} 
              cy={mapY(p.weight)} 
              r={hoveredPoint === i ? "12" : "8"} 
              fill="none" 
              stroke="#14b8a6" 
              strokeWidth="2" 
              opacity={hoveredPoint === i ? "0.5" : "0.3"}
              className="transition-all"
            />
          </g>
        ))}
        
        {/* Labels */}
        <text x={pad} y={height-10} fontSize="12" fill="currentColor" className="text-gray-500">
          {new Date(points[0].date).toLocaleDateString('pt-BR', { month: 'short' })}
        </text>
        <text x={width-pad} y={height-10} fontSize="12" fill="currentColor" textAnchor="end" className="text-gray-500">
          {new Date(points[points.length-1].date).toLocaleDateString('pt-BR', { month: 'short' })}
        </text>
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div 
          className="absolute bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-xl text-sm font-medium pointer-events-none"
          style={{
            left: `${(mapX(hoveredPoint) / width) * 100}%`,
            top: `${(mapY(points[hoveredPoint].weight) / height) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="text-center">
            <div className="text-xs opacity-75 mb-1">
              {new Date(points[hoveredPoint].date).toLocaleDateString('pt-BR')}
            </div>
            <div className="text-lg font-bold">
              {points[hoveredPoint].weight} kg
            </div>
          </div>
          {/* Arrow */}
          <div 
            className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid currentColor'
            }}
          />
        </div>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center p-3 bg-white dark:bg-[#0d0d0d] rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Atual</p>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{points[points.length-1].weight} kg</p>
        </div>
        <div className="text-center p-3 bg-white dark:bg-[#0d0d0d] rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Máximo</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{maxW} kg</p>
        </div>
        <div className="text-center p-3 bg-white dark:bg-[#0d0d0d] rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Mínimo</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{minW} kg</p>
        </div>
      </div>
    </div>
  )
}

export default function PetDetails(){
  const { id } = useParams()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [weightForm, setWeightForm] = useState({ date: '', weight: '' })
  const [photoPreview, setPhotoPreview] = useState(null)
  const user = getUser()
  
  // Estados para edição de vacina
  const [editingVaccine, setEditingVaccine] = useState(null)
  const [vaccineEditForm, setVaccineEditForm] = useState({ name: '', date: '', nextDate: '', lot: '', vet: '' })
  const [deletingVaccine, setDeletingVaccine] = useState(null)
  
  // Estados para edição de peso
  const [editingWeight, setEditingWeight] = useState(null)
  const [weightEditForm, setWeightEditForm] = useState({ date: '', weight: '' })
  const [deletingWeight, setDeletingWeight] = useState(null)

  const load = async () => {
    setLoading(true)
    try{
      const data = await petsApi.get(id)
      
      // Calcular peso atual baseado no registro mais recente
      if (data.weights && data.weights.length > 0) {
        const sortedWeights = [...data.weights].sort((a, b) => new Date(b.date) - new Date(a.date))
        data.currentWeight = sortedWeights[0].weight
      } else {
        data.currentWeight = data.weight
      }
      
      setPet(data)
    }catch(err){
      setToast(err.message || 'Erro ao carregar pet')
    }finally{ setLoading(false) }
  }
  
  useEffect(()=>{ load() }, [id])

  const handleAddWeight = async (e) => {
    e.preventDefault()
    if(!weightForm.date || !weightForm.weight){ setToast('Preencha data e peso'); return }
    try{
      await petsApi.addWeight(id, weightForm)
      
      // Atualizar o peso atual do pet se for o registro mais recente
      const newDate = new Date(weightForm.date)
      const weights = pet.weights || []
      const isNewest = weights.every(w => new Date(w.date) <= newDate)
      
      if (isNewest) {
        // Atualizar peso atual do pet na API
        await petsApi.update(id, { ...pet, weight: parseFloat(weightForm.weight) })
      }
      
      setToast('Peso salvo com sucesso!')
      setWeightForm({ date:'', weight:'' })
      load()
    }catch(err){
      setToast(err.message || 'Erro ao salvar peso')
    }
  }

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Preview local imediato
  const reader = new FileReader();
  reader.onloadend = () => setPhotoPreview(reader.result);
  reader.readAsDataURL(file);

  try {
    setToast("Enviando foto...");

    // 1. Chama o método do API para subir imagem + atualizar backend
    const updated = await petsApi.updateImage(id, file);

    // 2. Atualiza o pet no estado
    setPet(updated);

    setToast("Foto atualizada com sucesso!");
  } catch (err) {
    console.error(err);
    setToast(err.message || "Erro ao atualizar imagem");
  }
};

  // Handlers para Vacinas
  const handleEditVaccine = (vaccine) => {
    setEditingVaccine(vaccine)
    setVaccineEditForm({
      name: vaccine.name,
      date: vaccine.date.split('T')[0], // Formato YYYY-MM-DD
      nextDate: vaccine.next ? vaccine.next.split('T')[0] : '',
      lot: vaccine.lot || '',
      vet: vaccine.vet || ''
    })
  }

  const handleUpdateVaccine = async (e) => {
    e.preventDefault()
    if(!vaccineEditForm.name || !vaccineEditForm.date){ 
      setToast('Nome e data são obrigatórios'); 
      return 
    }
    try{
      await petsApi.updateVaccine(id, editingVaccine.id, {
        name: vaccineEditForm.name,
        date: vaccineEditForm.date,
        next: vaccineEditForm.nextDate || null,
        lot: vaccineEditForm.lot || null,
        vet: vaccineEditForm.vet || null
      })
      setToast('Vacina atualizada com sucesso!')
      setEditingVaccine(null)
      setVaccineEditForm({ name: '', date: '', nextDate: '', lot: '', vet: '' })
      load()
    }catch(err){
      setToast(err.message || 'Erro ao atualizar vacina')
    }
  }

  const handleDeleteVaccine = async () => {
    try{
      await petsApi.deleteVaccine(id, deletingVaccine.id)
      setToast('Vacina deletada com sucesso!')
      setDeletingVaccine(null)
      load()
    }catch(err){
      setToast(err.message || 'Erro ao deletar vacina')
    }
  }

  // Handlers para Pesos
  const handleEditWeight = (weight) => {
    setEditingWeight(weight)
    setWeightEditForm({
      date: weight.date.split('T')[0], // Formato YYYY-MM-DD
      weight: weight.weight.toString()
    })
  }

  const handleUpdateWeight = async (e) => {
    e.preventDefault()
    if(!weightEditForm.date || !weightEditForm.weight){ 
      setToast('Data e peso são obrigatórios'); 
      return 
    }
    try{
      await petsApi.updateWeight(id, editingWeight.id, {
        date: weightEditForm.date,
        weight: Number(weightEditForm.weight)
      })
      setToast('Peso atualizado com sucesso!')
      setEditingWeight(null)
      setWeightEditForm({ date: '', weight: '' })
      load()
    }catch(err){
      setToast(err.message || 'Erro ao atualizar peso')
    }
  }

  const handleDeleteWeight = async () => {
    try{
      await petsApi.deleteWeight(id, deletingWeight.id)
      setToast('Peso deletado com sucesso!')
      setDeletingWeight(null)
      load()
    }catch(err){
      setToast(err.message || 'Erro ao deletar peso')
    }
  }

  if(loading || !pet) return <Loading/>
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/pets" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{pet.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{pet.species} • {pet.breed}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {user && <QRCodeGenerator userId={user.id} petId={id} />}
          <Link 
            to={`/pets/${id}/add-vaccine`} 
            className="py-2 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <span>💉</span>
            Adicionar Vacina
          </Link>
        </div>
      </div>
      
      {/* Pet Photo */}
      <div className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-900 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-6xl overflow-hidden">
              {photoPreview ? (
  <img src={photoPreview} className="w-full h-full object-cover" />
) : pet.photoUrl ? (
  <img src={pet.photoUrl} className="w-full h-full object-cover" />
) : (
  '🐾'
)}
            </div>
            <label className="mt-3 block">
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <div className="cursor-pointer text-center py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                📸 Alterar Foto
              </div>
            </label>
          </div>
          
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Espécie</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pet.species}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Raça</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pet.breed || '-'}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Idade</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{pet.age} {pet.age === 1 ? 'ano' : 'anos'}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Peso atual</p>
              <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                {pet.currentWeight || pet.weight || '-'} kg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vaccines */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <span>💉</span> Histórico de Vacinas
      </h2>
      <div className="space-y-3 mb-8">
        {(!pet.vaccines || pet.vaccines.length === 0) && (
          <div className="bg-white dark:bg-[#0d0d0d] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-900 text-center">
            <div className="text-6xl mb-3">💉</div>
            <p className="text-gray-500 dark:text-gray-400">Nenhuma vacina registrada ainda.</p>
          </div>
        )}
        {pet.vaccines && pet.vaccines.map(v => {
          const nextDate = v.next ? new Date(v.next) : null
          const today = new Date()
          const daysUntil = nextDate ? Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24)) : null
          const isUrgent = daysUntil !== null && daysUntil <= 7 && daysUntil >= 0
          
          return (
            <div 
              key={v.id} 
              className={`bg-white dark:bg-[#0d0d0d] p-5 rounded-2xl shadow-sm border transition-all hover:shadow-md ${
                isUrgent 
                  ? 'border-red-200 dark:border-red-900' 
                  : 'border-gray-100 dark:border-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{v.name}</h3>
                    {isUrgent && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-medium rounded-full">
                        Urgente!
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>📅 Última aplicação: {new Date(v.date).toLocaleDateString('pt-BR')}</p>
                    {v.next && (
                      <p className={isUrgent ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                        🔔 Próxima dose: {new Date(v.next).toLocaleDateString('pt-BR')} 
                        {daysUntil !== null && daysUntil >= 0 && ` (${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'})`}
                      </p>
                    )}
                    {v.vet && <p>👨‍⚕️ Veterinário: {v.vet}</p>}
                    {v.lot && <p>🏷️ Lote: {v.lot}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditVaccine(v)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => setDeletingVaccine(v)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Weight History */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <span>📊</span> Evolução do Peso
      </h2>
      <div className="bg-white dark:bg-[#0d0d0d] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-900 mb-4">
        <WeightChart weights={pet.weights || []} />
        
        {/* Lista de registros de peso */}
        {pet.weights && pet.weights.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Registros de Peso</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pet.weights.sort((a, b) => new Date(b.date) - new Date(a.date)).map(w => (
                <div 
                  key={w.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(w.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {w.weight} kg
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditWeight(w)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => setDeletingWeight(w)}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Adicionar novo registro</h3>
          <form onSubmit={handleAddWeight} className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
              <input 
                type="date" 
                value={weightForm.date} 
                onChange={e=>setWeightForm({...weightForm, date: e.target.value})} 
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                value={weightForm.weight} 
                onChange={e=>setWeightForm({...weightForm, weight: e.target.value})} 
                placeholder="0.0" 
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" 
              />
            </div>
            <button className="py-3 px-6 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm">
              Adicionar
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Edição de Vacina */}
      {editingVaccine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Editar Vacina</h2>
            <form onSubmit={handleUpdateVaccine} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da vacina *</label>
                <input 
                  value={vaccineEditForm.name} 
                  onChange={e=>setVaccineEditForm({...vaccineEditForm, name: e.target.value})} 
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data da aplicação *</label>
                <input 
                  type="date"
                  value={vaccineEditForm.date} 
                  onChange={e=>setVaccineEditForm({...vaccineEditForm, date: e.target.value})} 
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Próxima dose</label>
                <input 
                  type="date"
                  value={vaccineEditForm.nextDate} 
                  onChange={e=>setVaccineEditForm({...vaccineEditForm, nextDate: e.target.value})} 
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lote</label>
                <input 
                  value={vaccineEditForm.lot} 
                  onChange={e=>setVaccineEditForm({...vaccineEditForm, lot: e.target.value})} 
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Veterinário</label>
                <input 
                  value={vaccineEditForm.vet} 
                  onChange={e=>setVaccineEditForm({...vaccineEditForm, vet: e.target.value})} 
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Salvar
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setEditingVaccine(null)
                    setVaccineEditForm({ name: '', date: '', nextDate: '', lot: '', vet: '' })
                  }}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Deleção de Vacina */}
      {deletingVaccine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Confirmar Exclusão</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja deletar a vacina <strong>{deletingVaccine.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleDeleteVaccine}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Deletar
              </button>
              <button 
                onClick={() => setDeletingVaccine(null)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Peso */}
      {editingWeight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Editar Peso</h2>
            <form onSubmit={handleUpdateWeight} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data *</label>
                <input 
                  type="date"
                  value={weightEditForm.date} 
                  onChange={e=>setWeightEditForm({...weightEditForm, date: e.target.value})} 
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (kg) *</label>
                <input 
                  type="number"
                  step="0.1"
                  value={weightEditForm.weight} 
                  onChange={e=>setWeightEditForm({...weightEditForm, weight: e.target.value})} 
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all" 
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Salvar
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setEditingWeight(null)
                    setWeightEditForm({ date: '', weight: '' })
                  }}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Deleção de Peso */}
      {deletingWeight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Confirmar Exclusão</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja deletar o registro de peso de <strong>{new Date(deletingWeight.date).toLocaleDateString('pt-BR')}</strong> ({deletingWeight.weight} kg)? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleDeleteWeight}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Deletar
              </button>
              <button 
                onClick={() => setDeletingWeight(null)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onClose={()=>setToast(null)} />
    </div>
  )
}