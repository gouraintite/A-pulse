import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { LoginForm } from '../features/auth/LoginForm';

export function LoginPage() {
  return (
    <PublicLayout>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Se connecter</h2>
        <p className="text-sm text-gray-600 mb-6">
          Rejoignez la plateforme Apulse pour donner et recevoir des feedbacks.
        </p>

        <LoginForm />

        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-700 hover:underline font-medium">
            Créer un compte
          </Link>
        </p>
      </div>
    </PublicLayout>
  );
}