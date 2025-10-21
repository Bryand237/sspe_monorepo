import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-tl from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center">
      <form className="w-full max-w-md bg-neutral-200 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" type="text" placeholder="admin" />
              <FieldDescription>Entrez le nom d'utilisateur.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="********" />
              <FieldDescription>Entrez le mot de passe.</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
        <button
          type="submit"
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
