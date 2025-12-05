import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AddPet from '../pages/AddPet'

test('requires name and species', () => {
  render(<BrowserRouter><AddPet /></BrowserRouter>)
  const button = screen.getByText(/Salvar/i)
  fireEvent.click(button)
  const toast = screen.getByText(/Nome e espécie são obrigatórios/i)
  expect(toast).toBeInTheDocument()
})
