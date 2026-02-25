import { useState } from "react";
import type { Parent } from "../../../../modules/authentication";
import {
  InvalidPasswordError,
  InvalidEmailError,
  isValidPasswordFormat,
  isValidEmail,
} from "../../../../modules/authentication";
import { useUseCases } from "../../../../app/providers/useUseCases";
import { useMutation } from "../../../hooks";
import { Input, Button, Alert } from "../../../design-system";
import { TermsModal } from "../../terms/modals/TermsModal";
import "./RegisterForm.css";

interface RegisterFormProps {
  onSuccess?: (parent: Parent) => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const useCases = useUseCases();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { mutate, isLoading, error, data } = useMutation<
    Parent,
    Error,
    { email: string; password: string }
  >(
    async (credentials: { email: string; password: string }) => {
      return await useCases.authentication.registerParentCommand(
        credentials.email,
        credentials.password,
      );
    },
    {
      onSuccess: (parent: Parent) => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setValidationErrors({});
        onSuccess?.(parent);
      },
    },
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});

    const validation = validateRegisterForm(
      email,
      password,
      confirmPassword,
      termsAccepted,
    );
    if (validation.errors && Object.keys(validation.errors).length > 0) {
      setValidationErrors(validation.errors);
      return;
    }

    mutate({ email, password });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {error && (
        <Alert type="error">
          {error instanceof InvalidEmailError
            ? "Email invalide ou déjà utilisé"
            : error instanceof InvalidPasswordError
              ? "Le mot de passe doit contenir au moins 8 caractères"
              : error.message}
        </Alert>
      )}

      {data && (
        <Alert type="success">
          Compte créé avec succès ! Redirection en cours...
        </Alert>
      )}

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        placeholder="votre@email.com"
        error={validationErrors.email}
        disabled={isLoading}
        required
      />

      <Input
        type="password"
        label="Mot de passe"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        placeholder="••••••••"
        helperText="Au minimum 8 caractères"
        error={validationErrors.password}
        disabled={isLoading}
        required
      />

      <Input
        type="password"
        label="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setConfirmPassword(e.target.value)
        }
        placeholder="••••••••"
        error={validationErrors.confirmPassword}
        disabled={isLoading}
        required
      />
      <p>Test</p>
      <input
        id="terms-acceptance-checkbox"
        type="checkbox"
        className="register-form__checkbox"
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        disabled={isLoading}
        required
      />
      <div className="register-form__checkbox-group">
        <input
          id="terms-acceptance-checkbox"
          type="checkbox"
          className="register-form__checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          disabled={isLoading}
          required
        />
        <label
          htmlFor="terms-acceptance-checkbox"
          className="register-form__checkbox-label"
        >
          J'accepte les{" "}
          <button
            type="button"
            className="register-form__terms-link"
            onClick={(e) => {
              e.preventDefault();
              setShowTermsModal(true);
            }}
            disabled={isLoading}
          >
            conditions d'utilisation
          </button>
        </label>
      </div>
      {validationErrors.termsAccepted && (
        <p className="register-form__error">{validationErrors.termsAccepted}</p>
      )}

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      <Button type="submit" isLoading={isLoading} size="md">
        Créer un compte
      </Button>
    </form>
  );
};

const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string,
  termsAccepted: boolean,
): { errors?: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Email format is invalid";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (!isValidPasswordFormat(password)) {
    errors.password = "Password must be at least 8 characters long";
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!termsAccepted) {
    errors.termsAccepted = "You must accept the terms and conditions";
  }

  return { errors };
};
