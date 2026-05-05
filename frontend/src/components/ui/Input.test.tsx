import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('affiche le label', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('affiche un message d\'erreur', () => {
    render(<Input label="Email" name="email" error="Email invalide" />);
    expect(screen.getByText('Email invalide')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('affiche un helperText quand pas d\'erreur', () => {
    render(<Input label="Mot de passe" name="password" helperText="8 caractères minimum" />);
    expect(screen.getByText('8 caractères minimum')).toBeInTheDocument();
  });

  it('cache le helperText quand il y a une erreur', () => {
    render(
      <Input
        label="Mot de passe"
        name="password"
        helperText="8 caractères minimum"
        error="Trop court"
      />,
    );
    expect(screen.queryByText('8 caractères minimum')).not.toBeInTheDocument();
    expect(screen.getByText('Trop court')).toBeInTheDocument();
  });

  it('appelle onChange quand on tape', async () => {
    const user = userEvent.setup();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // simple capture
      capturedValue = e.target.value;
    };
    let capturedValue = '';

    render(<Input label="Email" name="email" onChange={handleChange} />);
    await user.type(screen.getByLabelText('Email'), 't');

    expect(capturedValue).toBe('t'); // userEvent.type tape lettre par lettre
  });
});