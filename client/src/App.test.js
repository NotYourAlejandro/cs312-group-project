import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url === "/api/users/1") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 1,
          firstName: "John",
          lastName: "Doe",
          profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
          listings: [],
        }),
      });
    }

    if (url === "/api/listings") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 1,
            name: "Cozy downtown loft",
            description: "Bright and modern loft in the heart of the city.",
            price: 180,
            location: "Portland, OR",
            amenities: ["Wi-Fi", "Parking"],
            images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"],
          },
        ]),
      });
    }

    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders the app header and home page listings", async () => {
  render(<App />);

  expect(await screen.findByText(/StayFinder/i)).toBeInTheDocument();
  expect(await screen.findByText(/Cozy downtown loft/i)).toBeInTheDocument();
});
