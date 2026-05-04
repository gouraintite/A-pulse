import { PublicLayout } from '../components/layout/PublicLayout';

export function RegisterPage() {
  return (
    <PublicLayout>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un compte</h2>
        <p className="text-gray-600">Le formulaire arrive en...</p>
      </div>
    </PublicLayout>
  );
}