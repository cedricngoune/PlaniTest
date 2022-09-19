import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../../components/header/Header';
import { MemoryRouter } from "react-router-dom";


test('renders Header', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
  const h1Element = screen.getByText(/PLANITEST/i);
  expect(h1Element).toBeInTheDocument();
});
