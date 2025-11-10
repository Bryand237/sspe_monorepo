import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginFormData {
  username: string;
  password: string;
}

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const success = await login(data.username, data.password);
      if (success) {
        toast.success("Connexion réussie!");
        navigate(from, { replace: true });
      } else {
        toast.error("Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la connexion");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white/20 backdrop-blur-sm p-8 rounded-lg shadow-lg text-white"
      >
        <div className="flex flex-col items-center mb-6">
          <LogIn className="w-12 h-12 mb-3" />
          <h2 className="text-3xl font-bold text-center">Connexion</h2>
          <p className="text-white/80 text-sm mt-2">SSPE - Système de Suivi du Personnel Enseignant</p>
        </div>
        
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel className="font-semibold text-lg" htmlFor="username">
                Nom d'utilisateur
              </FieldLabel>
              <Input
                {...register("username", { required: "Le nom d'utilisateur est requis" })}
                className="text-foreground bg-white/90 placeholder:text-muted-foreground"
                id="username"
                type="text"
                placeholder="admin"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-red-200 text-sm mt-1">{errors.username.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel className="font-semibold text-lg" htmlFor="password">
                Mot de passe
              </FieldLabel>
              <Input 
                {...register("password", { required: "Le mot de passe est requis" })}
                className="text-foreground bg-white/90 placeholder:text-muted-foreground"
                id="password" 
                type="password" 
                placeholder="********"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-200 text-sm mt-1">{errors.password.message}</p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </>
          )}
        </Button>
        
        <div className="mt-6 text-center text-sm text-white/70">
          <p>Identifiants de test:</p>
          <p className="font-mono mt-1">admin / admin</p>
        </div>
      </form>
    </div>
  );
}

export default Login;
