import { PublicLayout } from '../components/layout/PublicLayout';

export function LoginPage() {
  return (
    <PublicLayout>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Se connecter</h2>
        <p className="text-gray-600">Le formulaire arrive après le register.</p>
      </div>
    </PublicLayout>
  );
}