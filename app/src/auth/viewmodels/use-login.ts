import { useState } from "react";
import { AuthService } from "../services/auth.services";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export function useLogin(){
    const router = useRouter()
    const {saveSession}=useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string|null>(null)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const togglePasswordVisibility=()=>{

        setIsPasswordVisible((prev)=>!prev)
    }

    const handleLogin=async()=>{
    if(!email || !password){
        setErrorMessage("Please, complete all fields")
        return
    }
    setErrorMessage(null)
    setIsLoading(true)

    try {
        const data = await AuthService.login(email,password)
        await saveSession(data.token,data.userResponse)
        
    } catch (error:any) {
        setErrorMessage(error.message)
    }finally{
        setIsLoading(false)
    }
}

    return {
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    errorMessage,
    isPasswordVisible,
    togglePasswordVisibility,
    handleLogin
    }

}