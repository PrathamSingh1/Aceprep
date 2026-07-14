import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <RegisterForm />
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-4">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}
