import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ProductService } from "../../services/product.services";
import { useAuth } from "@/app/src/context/AuthContext";
import { Alert } from "react-native";
import { CategoryResponse, CategoryService } from "../../../categories/services/category.services";

export function useCreateProduct() {
    const router = useRouter()
    const { token } = useAuth()

    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState<null | number>(null)
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false)
    const [sku, setSku] = useState("")
    const [description, setDescription] = useState("")
    const [regularPrice, setRegularPrice] = useState("")
    const [offerPrice, setOfferPrice] = useState("")
    const [initialStock, setInitialStock] = useState("")
    const [minStockAlert, setMinStockAlert] = useState("")
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [selectedCategoryName, setSelectedCategoryName] = useState("")

    useEffect(() => {
        if (token) {
            fetchCategories()
        }
    }, [token])

    const fetchCategories = async () => {
        if (!token) return
        setIsLoadingCategories(true)
        try {
            const data = await CategoryService.getCategories(token)
            setCategories(data)
        } catch (error: any) {
            console.log("Error al cargar las categories", error.message);
        } finally {
            setIsLoadingCategories(false)
        }
    }

    const submitProduct = async () => {
        if (!name.trim() || !sku.trim() || !regularPrice.trim() || !initialStock.trim()) {
            setErrorMessage("Por favor completa los campos obligatorios")
            return
        }

        if (!token) {
            setErrorMessage("Sesion no valida")
            return
        }

        setErrorMessage(null)
        setIsLoadingProduct(true)



        try {
            const response = await ProductService.createProduct(
                {
                    name: name.trim(),
                    categoryId: Number(categoryId),
                    sku: sku.trim(),
                    description: description.trim(),
                    regularPrice: parseFloat(regularPrice),
                    offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
                    initialStock: parseInt(initialStock, 10),
                    minStockAlert: minStockAlert ? parseInt(minStockAlert, 10) : 0
                },
                token
            );
            console.log("Respuesta", response);

            Alert.alert("Exito", "Producto creado correctamente", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(protected)/dashboard")
                }
            ])
        } catch (error: any) {
            setErrorMessage(error.message)
        } finally {
            setIsLoadingProduct(false)
        }

    }
    return {
        name,
        setName,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        isLoadingProduct,
        errorMessage,
        submitProduct,
        selectedCategoryName,
        setSelectedCategoryName
    }

}


