import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PetsList from './pages/PetsList'
import PetDetails from './pages/PetDetails'
import AddPet from './pages/AddPet'
import AddVaccine from './pages/AddVaccine'
import PublicProfile from './pages/PublicProfile'
export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/share/user/:userId" element={<PublicProfile />} />
          <Route path="/share/user/:userId/pet/:petId" element={<PublicProfile />} />
          <Route path="/" element={<Navigate to='/dashboard' replace />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/pets" element={<PetsList/>} />
          <Route path="/pets/add" element={<AddPet/>} />
          <Route path="/pets/:id" element={<PetDetails/>} />
          <Route path="/pets/:id/add-vaccine" element={<AddVaccine/>} />
        </Routes>
      </div>
    </div>
  )
}
