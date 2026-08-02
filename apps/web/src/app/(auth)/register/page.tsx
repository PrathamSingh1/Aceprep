import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
