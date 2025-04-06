import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import * as api from "../api";
import App from "./App";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

jest.mock("../api");

const mockedApi = api.default as jest.Mocked<typeof api.default>;

describe("App component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner initially", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: { results: [], total: 0 },
    });

    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        document.querySelector(".ant-spin-spinning")
      ).not.toBeInTheDocument()
    );
  });

  it("renders media results", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            title: "Test Photo",
            photographer: "John",
            date: "2024-04-01",
            imageUrl: "https://fake.url/photo.jpg",
          },
        ],
        total: 1,
      },
    });

    render(<App />, { wrapper: createWrapper() });

    expect(await screen.findByText(/Test Photo/)).toBeInTheDocument();
    expect(screen.getByText(/John/)).toBeInTheDocument();
  });

  it("shows error when API fails", async () => {
    mockedApi.get.mockRejectedValueOnce(new Error("API failed"));

    render(<App />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    expect(await screen.findByTestId("error-msg")).toBeInTheDocument();
  });

  it("changes page when pagination is clicked", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            title: "Test Page 1",
            photographer: "Alice",
            date: "2024-04-01",
            imageUrl: "https://fake.url/photo1.jpg",
          },
        ],
        total: 100,
      },
    });

    render(<App />, { wrapper: createWrapper() });

    expect(await screen.findByText("Test Page 1")).toBeInTheDocument();

    // Mock API call for page 2
    mockedApi.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            title: "Test Page 2",
            photographer: "Bob",
            date: "2024-04-02",
            imageUrl: "https://fake.url/photo2.jpg",
          },
        ],
        total: 100,
      },
    });

    const page2Button = screen.getByRole("listitem", { name: "2" });
    await userEvent.click(page2Button);

    expect(await screen.findByText("Test Page 2")).toBeInTheDocument();
  });

  it("shows empty state when no results are returned", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        results: [],
        total: 0,
      },
    });

    render(<App />, { wrapper: createWrapper() });

    expect(await screen.findByText(/no results/i)).toBeInTheDocument();
  });
});
