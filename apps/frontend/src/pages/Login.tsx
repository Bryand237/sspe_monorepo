import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-tl from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center">
      <form className="w-full max-w-md bg-white/20 backdrop-blur-sm p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel className="font-semibold text-xl" htmlFor="username">
                Username
              </FieldLabel>
              <Input
                className="text-white placeholder:text-white outline-2 outline-white focus:outline-accent"
                id="username"
                type="text"
                placeholder="admin"
              />
              {/* <FieldDescription>Entrez le nom d'utilisateur.</FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel className="font-semibold text-xl" htmlFor="password">
                Password
              </FieldLabel>
              <Input id="password" type="password" placeholder="********" />
              {/* <FieldDescription>Entrez le mot de passe.</FieldDescription> */}
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
