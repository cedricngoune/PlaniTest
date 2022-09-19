import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';
import '@testing-library/jest-dom'


test('renders App', async () => {
  const { container } = render(<App />);
  const h1Element = screen.getByText("PLANITEST");
  expect(h1Element).toBeInTheDocument();

  const timeLineElements = await screen.findAllByText(/[\d]h/i);
  expect(timeLineElements).toHaveLength(13);

  const appointmentElements = container.getElementsByTagName("p");
  expect(appointmentElements.length).toEqual(17);

  const nineAMElement = screen.getByText("09h");
  expect(nineAMElement).toBeInTheDocument();
  const ninePMElement = screen.getByText("21h");
  expect(ninePMElement).toBeInTheDocument();
});