import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { AuthContext } from '../../hooks/AuthContext';
import type { LoginResponse } from '../../types/auth';

const mockRegister = vi.fn();
const mockLogin = vi.fn();
const mockLogout = vi.fn();

const renderWithProviders = (registerImpl?: typeof mockRegister) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: null,
          isLoading: false,
          isAuthenticated: false,
          register: registerImpl ?? mockRegister,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <LoginForm />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche tous les champs requis', () => {
    renderWithProviders();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('affiche des erreurs si les champs requis sont vides', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText("L'email est requis")).toBeInTheDocument();
    expect(screen.getByText('Le mot de passe est requis')).toBeInTheDocument();
  });

  it('valide le format de l\'email', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Email'), 'pas-un-email');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText("Format d'email invalide")).toBeInTheDocument();
  });

  it('valide la longueur du mot de passe', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Email'), 'test@axa.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'short');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(
      await screen.findByText('Le mot de passe doit contenir au moins 8 caractères'),
    ).toBeInTheDocument();
  });

  it('appelle register avec les bonnes données quand le formulaire est valide', async () => {
    const user = userEvent.setup();
    const fakeUser: LoginResponse = {    
        user: {
            id: 1,
            email: 'test@axa.fr',
            firstName: 'Rainsong',
            lastName: 'Ngoutsop',
            role: 'User',
            createdAt: '2026-05-04T00:00:00Z',
        },
        token: 'fake-jwt-token',
        expiresAt: '2026-05-05T00:00:00Z',
    };
    const loginMock = vi.fn().mockResolvedValue(fakeUser);

    renderWithProviders(loginMock);

    await user.type(screen.getByLabelText('Email'), 'test@axa.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

  });

  it('affiche un message de succès après inscription', async () => {
    const user = userEvent.setup();
    const fakeUser: LoginResponse = {    
        user: {
            id: 1,
            email: 'test@axa.fr',
            firstName: 'Rainsong',
            lastName: 'Ngoutsop',
            role: 'User',
            createdAt: '2026-05-04T00:00:00Z',
        },
        token: 'fake-jwt-token',
        expiresAt: '2026-05-05T00:00:00Z',
    };
    const loginMock = vi.fn().mockResolvedValue(fakeUser);

    renderWithProviders(loginMock);

    await user.type(screen.getByLabelText('Email'), 'test@axa.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/connexion réussie/i);
  });
});