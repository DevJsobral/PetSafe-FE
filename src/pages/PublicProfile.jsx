import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { publicApi } from '../api'
import Loading from '../components/Loading'

export default function PublicProfile() {
  const { userId, petId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadData()
  }, [userId, petId])

  const loadData = async () => {
    setLoading(true)
    try {
      if (petId) {
        // Mostrar apenas um pet específico
        const response = await publicApi.getPet(petId)
        setData({ type: 'pet', pet: response.pet })
        setUser(response.owner)
      } else if (userId) {
        // Mostrar todos os pets do usuário
        const userData = await publicApi.getUserProfile(userId)
        setUser(userData)
        setData({ type: 'profile', pets: userData.pets })
      }
    } catch (err) {
      console.error('Erro ao carregar dados públicos:', err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full text-4xl mb-4">
            🐾
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            PetSafe
          </h1>
          {user && (
            <p className="text-gray-600 dark:text-gray-400">
              Perfil de <span className="font-semibold text-teal-600 dark:text-teal-400">{user.name}</span>
            </p>
          )}
        </div>

        {/* Content */}
        {data?.type === 'pet' && data.pet ? (
          // Mostrar um pet específico
          <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">{data.pet.name}</h2>
              <p className="text-teal-100">{data.pet.species} • {data.pet.breed}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Idade</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.pet.age}</p>
                  <p className="text-xs text-gray-500">{data.pet.age === 1 ? 'ano' : 'anos'}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Peso</p>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{data.pet.weight || '-'}</p>
                  <p className="text-xs text-gray-500">kg</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Raça</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{data.pet.breed || '-'}</p>
                </div>
              </div>

              {/* Vacinas */}
              {data.pet.vaccines && data.pet.vaccines.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span>💉</span> Vacinas
                  </h3>
                  <div className="space-y-2">
                    {data.pet.vaccines.map(v => (
                      <div key={v.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="font-semibold text-gray-900 dark:text-white">{v.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Última: {new Date(v.date).toLocaleDateString('pt-BR')}
                          {v.next && ` • Próxima: ${new Date(v.next).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contato de Emergência */}
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <p className="text-sm text-orange-800 dark:text-orange-400 font-medium mb-2">
                  📞 Contato de Emergência
                </p>
                {user && (
                  <>
                    <p className="text-gray-900 dark:text-white font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    {user.emergencyPhone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        📱 <a href={`tel:${user.emergencyPhone}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                          {user.emergencyPhone}
                        </a>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : data?.type === 'profile' && data.pets ? (
          // Mostrar todos os pets
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Meus Pets ({data.pets.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.pets.map(pet => (
                <div
                  key={pet.id}
                  className="bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                        🐾
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{pet.name}</h3>
                        <p className="text-teal-100 text-sm">{pet.species}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Raça</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{pet.breed || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Idade</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{pet.age} anos</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Peso</p>
                        <p className="font-semibold text-teal-600 dark:text-teal-400 text-sm">{pet.weight || '-'} kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contato */}
            <div className="mt-8 bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                📞 Informações de Contato
              </h3>
              {user && (
                <>
                  <p className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-1">{user.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  {user.emergencyPhone && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      📱 <a href={`tel:${user.emergencyPhone}`} className="text-teal-600 dark:text-teal-400 hover:underline font-medium">
                        {user.emergencyPhone}
                      </a>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-gray-600 dark:text-gray-400">Nenhuma informação encontrada.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gerado por <span className="font-bold text-teal-600 dark:text-teal-400">🐾 PetSafe</span>
          </p>
          <a
            href="/"
            className="inline-block mt-3 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            Criar minha conta
          </a>
        </div>
      </div>
    </div>
  )
}