import { useRouter } from "expo-router";
import { useState } from "react";
import { AuthService } from "../services/auth.services";


export function useRegister() {
    const [fullName, setFullName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>("")
    const [emailError, setEmailError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async () => {
        if (!fullName || !lastName || !phone || !email || !password || !confirmPassword) {
            setErrorMessage("All fields are required")
            return
        }

        if (password !== confirmPassword) {
            setErrorMessage("The password is not match  ")
            return
        }

        setErrorMessage(null)
        setIsLoading(true)

        try {

            setEmailError(null)

            await AuthService.register(
                fullName,
                lastName,
                phone,
                email,
                password
            )

            router.replace("/(public)")

        } catch (error: any) {

            if (error.message === "EMAIL_ALREADY_EXISTS") {

                setEmailError("Este correo ya está registrado")
                setErrorMessage(null)

            } else {

                setEmailError(null)
                setErrorMessage("Error al registrar usuario")

            }

        } finally {
            setIsLoading(false)
        }
    }

    return {
        fullName,
        lastName,
        password,
        confirmPassword,
        email,
        phone,
        handleRegister,
        setFullName,
        setLastName,
        setPassword,
        setConfirmPassword,
        setEmail,
        setPhone,
        errorMessage,
        emailError,
        setEmailError,
        isLoading
    }

}