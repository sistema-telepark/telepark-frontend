import { render, screen, act } from '@testing-library/react';
import App from './App';
import { TokenService } from './services/token.service';

const mockUser = {
  access: 'test-access-token',
  refresh: 'test-refresh-token',
  username: 'drhouse',
  name: 'Dr. House',
  is_superuser: false,
};

describe('App integration tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders Login when no token is present', async () => {
    render(<App />);
    // Login es lazy (Suspense): esperar la resolución del chunk antes de asertar
    expect(await screen.findByText(/login/i)).toBeInTheDocument();
  });

  test('renders sidebar and welcome message when token is present', () => {
    TokenService.setUser(mockUser);
    render(<App />);
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. House/i)).toBeInTheDocument();
  });

  test('re-renders when CustomEvent auth-change is dispatched (login simulation)', () => {
    render(<App />);
    // Initially no token - should show Login
    expect(screen.getByText(/login/i)).toBeInTheDocument();

    // Simulate login inside act() so React processes state updates
    act(() => {
      TokenService.setUser(mockUser);
    });

    // After the event, the welcome message should appear
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. House/i)).toBeInTheDocument();
  });

  test('removes user info when logout is triggered via auth-change', () => {
    TokenService.setUser(mockUser);
    render(<App />);
    expect(screen.getByText(/Bienvenido/i)).toBeInTheDocument();

    // Simulate logout inside act() so React processes state updates
    act(() => {
      TokenService.removeUser();
    });

    // After the event, Login should reappear
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/Bienvenido/i)).not.toBeInTheDocument();
  });
});
