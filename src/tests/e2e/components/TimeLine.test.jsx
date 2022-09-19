import { render, screen } from "@testing-library/react";
import React from "react";
import TimeLine from "../../../components/timeline/TimeLine";

test("TimeLine 24h", async () => {
  render(<TimeLine />);
  expect(screen.getByText('09h')).toBeInTheDocument();
  for (let i = 9; i < 21; i++) {
    const intOnTwoDigit = ("0" + i).slice(-2)
    expect(screen.getByText(`${intOnTwoDigit}h`)).toBeInTheDocument();
  }
})