import React from 'react'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8 bg-transparent">
        {children}
      </main>
    </div>
  )
}