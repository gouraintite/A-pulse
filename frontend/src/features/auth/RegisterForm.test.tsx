import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';
import { AuthContext } from '../../hooks/AuthContext';
import type { UserResponse } from '../../types/auth';

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
        <RegisterForm />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche tous les champs requis', () => {
    renderWithProviders();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer mon compte/i })).toBeInTheDocument();
  });

  it('affiche des erreurs si les champs requis sont vides', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    expect(await screen.findByText("L'email est requis")).toBeInTheDocument();
    expect(screen.getByText('Le mot de passe est requis')).toBeInTheDocument();
    expect(screen.getByText('Le prénom est requis')).toBeInTheDocument();
    expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
  });

  it('valide le format de l\'email', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Email'), 'pas-un-email');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.type(screen.getByLabelText('Prénom'), 'Rainsong');
    await user.type(screen.getByLabelText('Nom'), 'Ngoutsop');
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    expect(await screen.findByText("Format d'email invalide")).toBeInTheDocument();
  });

  it('valide la longueur du mot de passe', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Email'), 'test@axa.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'short');
    await user.type(screen.getByLabelText('Prénom'), 'Rainsong');
    await user.type(screen.getByLabelText('Nom'), 'Ngoutsop');
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    expect(
      await screen.findByText('Le mot de passe doit contenir au moins 8 caractères'),
    ).toBeInTheDocument();
  });

  it('appelle register avec les bonnes données quand le formulaire est valide', async () => {
    const user = userEvent.setup();
    const fakeUser: UserResponse = {
      id: 1,
      email: 'test@axa.fr',
      firstName: 'Rainsong',
      lastName: 'Ngoutsop',
      role: 'User',
      createdAt: '2026-05-04T00:00:00Z',
    };
    const registerMock = vi.fn().mockResolvedValue(fakeUser);

    renderWithProviders(registerMock);

    await user.type(screen.getByLabelText('Email'), 'test@axa.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.type(screen.getByLabelText('Prénom'), 'Rainsong');
    await user.type(screen.getByLabelText('Nom'), 'Ngoutsop');
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        email: 'test@axa.fr',
        password: 'password123',
        firstName: 'Rainsong',
        lastName: 'Ngoutsop',
        department: '',
      });
    });
  });

  it('affiche un message de succès après inscription', async () => {
    const user = userEvent.setup();
    const fakeUser: UserResponse = {
      id: 1,
      email: 'test@axa.fr',
      firstName: 'Rainsong',
      lastName: 'Ngoutsop',
      role: 'User',
      createdAt: '2026-05-04T00:00:00Z',
    };
    const registerMock = vi.fn().mockResolvedValue(fakeUser);

    renderWithProviders(registerMock);

    await user.type(screen.getByLabelText('Email'), 'test@axa.fr');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.type(screen.getByLabelText('Prénom'), 'Rainsong');
    await user.type(screen.getByLabelText('Nom'), 'Ngoutsop');
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/compte créé avec succès/i);
  });
});