import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

test('renders PetSafe navbar', () => {
  render(<BrowserRouter><App /></BrowserRouter>)
  const link = screen.getByText(/PetSafe/i)
  expect(link).toBeInTheDocument()
})
