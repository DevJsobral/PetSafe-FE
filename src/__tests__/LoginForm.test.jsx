import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'

test('shows validation when fields empty', () => {
  render(<BrowserRouter><Login /></BrowserRouter>)
  const button = screen.getByText(/Entrar/i)
  fireEvent.click(button)
  const toast = screen.getByText(/Preencha email e senha/i)
  expect(toast).toBeInTheDocument()
})
