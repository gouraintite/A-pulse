import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('affiche le texte passé en children', () => {
    render(<Button>Cliquez ici</Button>);
    expect(screen.getByRole('button', { name: 'Cliquez ici' })).toBeInTheDocument();
  });

  it('appelle onClick quand on clique', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("affiche 'Chargement...' quand isLoading est true", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Chargement...');
  });

  it('est désactivé quand isLoading est true', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('est désactivé quand disabled est true', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it("n'appelle pas onClick quand disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Click
      </Button>,
    );
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });
});