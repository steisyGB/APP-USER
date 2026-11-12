
import { useRouter } from "expo-router";
import { useState } from "react";
import { AuthService } from "../services/auth.services";

import {
    phoneFieldError,
    textFieldError,
    validEmail
} from "../../Validation/fields";

export function useRegister() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] =
        useState<string | null>("");

    const [emailError, setEmailError] =
        useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [fieldErrors, setFieldErrors] =
        useState<Record<string, string>>({});

    // Validación de nombres y apellidos
    const onTextField = (
        field: "fullName" | "lastName",
        value: string
    ) => {
        const label = field === "fullName"
            ? "Nombre"
            : "Apellido";

        const message = /\d/.test(value)
            ? `${label} no permite números`
            : "";

        setFieldErrors(prev => ({
            ...prev,
            [field]: message
        }));

        if (field === "fullName") {
            setFullName(value);
        } else {
            setLastName(value);
        }
    };

    // Validación de teléfono
    const onPhoneField = (value: string) => {
        const message = /[^\d -]/.test(value)
            ? "El teléfono solo permite números"
            : "";

        setFieldErrors(prev => ({
            ...prev,
            phone: message
        }));

        setPhone(value);
    };

    const handleRegister = async () => {
        const errors: Record<string, string> = {};

        const nameError = textFieldError(
            fullName,
            "Nombre"
        );

        const lastnameError = textFieldError(
            lastName,
            "Apellido"
        );

        const phoneError = phoneFieldError(phone);

        if (nameError) {
            errors.fullName = nameError;
        }

        if (lastnameError) {
            errors.lastName = lastnameError;
        }

        if (phoneError) {
            errors.phone = phoneError;
        }

        if (!validEmail(email)) {
            errors.email =
                "Ingresa un correo electrónico válido";
        }

        if (password.length < 6) {
            errors.password =
                "La contraseña debe tener al menos 6 caracteres";
        }

        if (!confirmPassword.trim()) {
            errors.confirmPassword =
                "Confirma tu contraseña";
        } else if (password !== confirmPassword) {
            errors.confirmPassword =
                "Las contraseñas no coinciden";
        }

        // Evitar el envío con datos incorrectos
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setErrorMessage(
                "Corrige los campos señalados antes de continuar"
            );
            return;
        }

        setFieldErrors({});
        setErrorMessage(null);
        setIsLoading(true);

        try {
            setEmailError(null);

            await AuthService.register(
                fullName.trim(),
                lastName.trim(),
                phone,
                email.trim(),
                password
            );

            router.replace("/(public)");
            

        } catch (error: any) {
            if (error.message === "EMAIL_ALREADY_EXISTS") {
                setEmailError("Este correo ya está registrado");
                setErrorMessage(null);
            } else {
                setEmailError(null);
                setErrorMessage("Error al registrar usuario");
            }

        } finally {
            setIsLoading(false);
        }
    };

    return {
        fullName,
        lastName,
        phone,
        email,
        password,
        confirmPassword,
        setFullName,
        setLastName,
        setPhone,
        setEmail,
        setPassword,
        setConfirmPassword,
        handleRegister,
        errorMessage,
        emailError,
        setEmailError,
        isLoading,
        fieldErrors,
        onTextField,
        onPhoneField
    };
}
