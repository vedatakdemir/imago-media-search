import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import MediaCard from "./MediaCard.tsx";

const props = {
  title: "A cool sunset",
  photographer: "Alice",
  date: "2024-01-01T00:00:00Z",
  imageUrl: "https://via.placeholder.com/300x200",
};

test("renders MediaCard correctly", () => {
  render(<MediaCard {...props} />);

  const images = screen.getAllByRole("img");

  expect(screen.getByText(/Alice/)).toBeInTheDocument();
  expect(screen.getByText(/A cool sunset/)).toBeInTheDocument();
  expect(images[0]).toHaveAttribute("src", props.imageUrl);
});
