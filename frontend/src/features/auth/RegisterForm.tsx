import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import type { RegisterRequest } from '../../types/auth';

type FormErrors = Partial<Record<keyof RegisterRequest, string>> & {
  global?: string;
};

const initialFormState: RegisterRequest = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  department: '',
};

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterRequest>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validation côté client
  const validate = (data: RegisterRequest): FormErrors => {
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

    if (!data.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    return newErrors;
  };

  const handleChange = (field: keyof RegisterRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await register(formData);
      setSuccessMessage('Compte créé avec succès ! Redirection vers la connexion...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          setErrors({ email: 'Cet email est déjà utilisé' });
        } else if (err.response?.status === 400 && err.response.data?.errors) {
          setErrors({ global: 'Données invalides. Vérifiez vos informations.' });
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prénom"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          error={errors.firstName}
          required
          autoComplete="given-name"
        />
        <Input
          label="Nom"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          error={errors.lastName}
          required
          autoComplete="family-name"
        />
      </div>

      <Input
        label="Département (optionnel)"
        type="text"
        name="department"
        value={formData.department ?? ''}
        onChange={handleChange('department')}
        autoComplete="organization"
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
        Créer mon compte
      </Button>
    </form>
  );
}