import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import type { LoginRequest } from '../../types/auth';

type FormErrors = Partial<Record<keyof LoginRequest, string>> & {
  global?: string;
};

const initialFormState: LoginRequest = {
  email: '',
  password: '',
};

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginRequest>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validation côté client
  const validate = (data: LoginRequest): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!data.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (data.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    return newErrors;
  };

  const handleChange = (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // On efface l'erreur du champ dès que l'utilisateur tape
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData);
      setSuccessMessage('Connexion réussie !');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          setErrors({ global: 'Email ou mot de passe incorrect.' });
        } else {
          setErrors({ global: 'Une erreur est survenue. Veuillez réessayer.' });
        }
      } else {
        setErrors({ global: 'Erreur réseau. Vérifiez votre connexion.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        required
        autoComplete="email"
      />

      <Input
        label="Mot de passe"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
        helperText="Au moins 8 caractères"
        required
        autoComplete="new-password"
      />

      {errors.global && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.global}
        </div>
      )}

      {successMessage && (
        <div role="status" className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
        Se connecter
      </Button>
    </form>
  );
}