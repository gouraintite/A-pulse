import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { RegisterForm } from '../features/auth/RegisterForm';

export function RegisterPage() {
  return (
    <PublicLayout>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h2>
        <p className="text-sm text-gray-600 mb-6">
          Rejoignez la plateforme Apulse pour donner et recevoir des feedbacks.
        </p>

        <RegisterForm />

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-700 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </PublicLayout>
  );
}