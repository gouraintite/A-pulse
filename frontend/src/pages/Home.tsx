import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/Button';

export function HomePage() {
  return (
    <PublicLayout>
      <div className="text-center bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Bienvenue sur Apulse</h2>
        <p className="text-gray-600 mb-8">
          Plateforme interne de feedback 360° pour collaborateurs.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/register">
            <Button variant="primary" size="lg" className="w-full cursor-pointer">
              Créer un compte
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="w-full cursor-pointer">
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}