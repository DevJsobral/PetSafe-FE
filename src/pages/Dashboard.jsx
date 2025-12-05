import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pets as petsApi, getUser } from '../api'
import QRCodeGenerator from '../components/QRCodeGenerator'

export default function Dashboard(){
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [upcomingVaccines, setUpcomingVaccines] = useState([])
  const user = getUser()

  useEffect(() => {
    loadData()
  }, [])

 const loadData = async () => {
  try {
    const data = await petsApi.list()
    setPets(data || [])

    // Calcular vacinas próximas do vencimento ou vencidas
    const vaccines = []
    data?.forEach(pet => {
      pet.vaccines?.forEach(vaccine => {
        if (vaccine.next) {
          const nextDate = new Date(vaccine.next)
          const today = new Date()
          const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24))

          // Considerar vacinas vencidas ou próximas do vencimento (30 dias)
          if (daysUntil <= 30) {
            vaccines.push({
              petName: pet.name,
              vaccineName: vaccine.name,
              date: vaccine.next,
              daysUntil,
              status: daysUntil < 0 ? 'expired' : 'upcoming' // marca se já passou
            })
          }
        }
      })
    })

    // Atualiza o estado dentro do try
    setUpcomingVaccines(vaccines.sort((a, b) => a.daysUntil - b.daysUntil))
  } catch (err) {
    console.error('Erro ao carregar dados:', err)
  } finally {
    setLoading(false)
  }
  }
  
  const hasExpiredVaccines = upcomingVaccines.some(v => v.status === 'expired');

  const stats = [
  {
    title: 'Pets cadastrados',
    value: loading ? '...' : pets.length,
    icon: '🐾',
    color: 'from-teal-500 to-teal-600',
    link: '/pets',
    linkText: 'Ver todos'
  },
  {
    title: 'Vacinas a vencer',
    value: loading ? '...' : upcomingVaccines.length,
    icon: '💉',
    color: 'from-orange-500 to-orange-600',
    urgent: upcomingVaccines.some(v => v.status === 'expired' || v.daysUntil <= 7)
  },
  {
    title: 'Próximo check-up',
    value: loading 
      ? '...' 
      : hasExpiredVaccines 
        ? 'Urgente!' 
        : (upcomingVaccines.length > 0 ? `${upcomingVaccines[0].daysUntil} dias` : '-'),
    icon: '📅',
    color: 'from-blue-500 to-blue-600',
    urgent: hasExpiredVaccines
  }
];

  const quickActions = [
    {
      icon: '❤️',
      title: 'Adicionar Pet',
      description: 'Cadastre um novo pet',
      link: '/pets/add'
    },
    {
      icon: '💉',
      title: 'Vacinas Pendentes',
      description: 'Veja lembretes',
      link: '#vaccines',
      onClick: (e) => {
        e.preventDefault()
        document.getElementById('vaccines')?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    {
      icon: '📊',
      title: 'Relatórios',
      description: 'Análise de saúde',
      link: '/pets'
    },
    {
      icon: '📸',
      title: 'Galeria',
      description: 'Fotos dos pets',
      link: '/pets'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Painel de Controle
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe a saúde e bem-estar dos seus pets
          </p>
        </div>
        {user && <QRCodeGenerator userId={user.id} />}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-900"
          >
            {/* Gradient Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="relative p-6">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                {stat.icon}
              </div>

              {/* Content */}
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {stat.title}
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {stat.value}
              </p>

              {/* Link or Badge */}
              {stat.link ? (
                <Link 
                  to={stat.link} 
                  className="inline-flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                >
                  {stat.linkText}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : stat.urgent ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400">
                  Atenção necessária
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

{/* Upcoming Vaccines Alert */}
{upcomingVaccines.length > 0 && (
  <div id="vaccines" className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 mb-8">
    <div className="flex items-start gap-3">
      <div className="text-3xl">⚠️</div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-orange-900 dark:text-orange-400 mb-4">
          Vacinas Próximas do Vencimento / Vencidas
        </h3>

        {/* Vacinas vencidas */}
        {upcomingVaccines.some(v => v.status === 'expired') && (
          <div className="mb-4">
            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Vencidas</h4>
            <div className="space-y-2">
              {upcomingVaccines.filter(v => v.status === 'expired').map((vaccine, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white dark:bg-[#0d0d0d] p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {vaccine.petName} - {vaccine.vaccineName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vencimento: {new Date(vaccine.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                    Vencida
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vacinas próximas do vencimento */}
        {upcomingVaccines.some(v => v.status === 'upcoming') && (
          <div>
            <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Próximas do Vencimento</h4>
            <div className="space-y-2">
              {upcomingVaccines.filter(v => v.status === 'upcoming').map((vaccine, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white dark:bg-[#0d0d0d] p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {vaccine.petName} - {vaccine.vaccineName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vencimento: {new Date(vaccine.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    vaccine.daysUntil <= 7 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                  }`}>
                    {vaccine.daysUntil} {vaccine.daysUntil === 1 ? 'dia' : 'dias'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}


      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-900 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="text-teal-600 dark:text-teal-400 mr-2">⚡</span>
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              onClick={action.onClick}
              className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 text-left group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
              <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}