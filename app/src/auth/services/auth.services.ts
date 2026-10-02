import { AuthResponse, UserResponse } from "../models/auth.model";
import axios from "axios"
const API_URL = "https://api-ecommerce-5aby.onrender.com"
export const AuthService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            })

            return response.data
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || "Error to login")
            }
            throw new Error("Server error")
        }
    },

    register: async (
        name: string,
        lastname: string,
        phone: string,
        email: string,
        password: string
    ) => {

        try {

            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                lastname,
                phone,
                email,
                password
            })

            return response.data

        } catch (error: any) {

            if (axios.isAxiosError(error) && error.response) {

                console.log("STATUS:", error.response.status)
                console.log("RESPUESTA API:", error.response.data)

                const status = error.response.status

                const apiError = JSON.stringify(
                    error.response.data
                ).toLowerCase()

                console.log("STATUS:", status)
                console.log("RESPUESTA API:", error.response.data)

                if (
                    status === 409 ||
                    apiError.includes("already exists") ||
                    apiError.includes("already registered") ||
                    apiError.includes("email already") ||
                    apiError.includes("correo ya") ||
                    apiError.includes("email exists") ||
                    apiError.includes("usuario ya existe")
                ) {
                    throw new Error("EMAIL_ALREADY_EXISTS")
                }

                throw new Error(
                    error.response.data?.message ||
                    error.response.data?.error ||
                    "Error al registrar usuario"
                )
            }
        }
    },

    updateUser: async (
        userId: number,
        name: string,
        lastname: string,
        phone: string,
        token: string
    ): Promise<UserResponse> => {
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("lastname", lastname)
            formData.append("phone", phone)

            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`
            const response = await axios.put(`${API_URL}/users/upload/${userId}`, formData, {
                headers: {
                    "Authorization":authTokenHeader,
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        } catch (error: any) {
            console.log(error);
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.message || "Error to login")
            }
            throw new Error("Server error")
        }
    }
}