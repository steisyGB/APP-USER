
import { useAuth } from "@/app/src/context/AuthContext";
import { useRouter } from "expo-router";
import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { Alert } from "react-native";

import {
    CategoryResponse,
    CategoryService
} from "../../categories/services/category.services";

import { ProductService } from "../services/product.services";
import { ProductItem } from "../models/product.model";

import {
    validateProductFields,
    ProductField,
    ProductFieldErrors,
    ProductValidationData
} from "../../Validation/fields";

export function useCreateProduct() {
    const router = useRouter();
    const { token } = useAuth();

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] =
        useState<null | number>(null);

    const [categories, setCategories] =
        useState<CategoryResponse[]>([]);

    const [selectedCategoryId, setSelectedCategoryId] =
        useState<number | null>(null);

    const [products, setProducts] =
        useState<ProductItem[]>([]);

    const [isLoadingCategories, setIsLoadingCategories] =
        useState(false);

    const [
        isCategoriesShowModal,
        setIsCategoriesShowModal
    ] = useState(false);

    const [sku, setSku] = useState("");
    const [description, setDescription] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [initialStock, setInitialStock] = useState("");
    const [minStockAlert, setMinStockAlert] = useState("");

    const [isLoadingProduct, setIsLoadingProduct] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [selectedCategoryName, setSelectedCategoryName] =
        useState("");

    const [searchQuery, setSearchQuery] = useState("");

    // NUEVO: errores de validación
    const [fieldErrors, setFieldErrors] =
        useState<ProductFieldErrors>({});

    // Obtener todos los valores del formulario
    const getFormData = (): ProductValidationData => ({
        name,
        categoryId,
        sku,
        regularPrice,
        offerPrice,
        initialStock,
        minStockAlert
    });

    // NUEVO: validar mientras se escribe
    const handleFieldChange = (
        field: Exclude<ProductField, "categoryId">,
        value: string
    ) => {
        const updatedData = {
            ...getFormData(),
            [field]: value
        };

        const errors = validateProductFields(updatedData);

        // Mostrar o quitar el error del campo editado
        setFieldErrors(prev => ({
            ...prev,
            [field]: errors[field],
            // La oferta depende del precio regular
            ...(field === "regularPrice"
                ? { offerPrice: errors.offerPrice }
                : {})
        }));

        // Mantener los estados originales
        switch (field) {
            case "name":
                setName(value);
                break;

            case "sku":
                setSku(value);
                break;

            case "regularPrice":
                setRegularPrice(value);
                break;

            case "offerPrice":
                setOfferPrice(value);
                break;

            case "initialStock":
                setInitialStock(value);
                break;

            case "minStockAlert":
                setMinStockAlert(value);
                break;
        }

        setErrorMessage(null);
    };

    // NUEVO: validar al seleccionar categoría
    const handleCategoryChange = (
        id: number,
        categoryName: string
    ) => {
        setCategoryId(id);
        setSelectedCategoryName(categoryName);

        setFieldErrors(prev => ({
            ...prev,
            categoryId: undefined
        }));

        setErrorMessage(null);
        setIsCategoriesShowModal(false);
    };

    // CARGAR CATEGORÍAS
    useEffect(() => {
        if (token) {
            fetchCategories();
        }
    }, [token]);

    // OBTENER PRODUCTOS
    const fetchProducts = useCallback(async () => {
        if (!token) return;

        setIsLoadingProduct(true);

        try {
            if (selectedCategoryId === null) {
                const data =
                    await ProductService.getProductsByCategoryId(
                        1,
                        token
                    );

                setProducts(data);
            } else {
                const data =
                    await ProductService.getProductsByCategoryId(
                        Number(selectedCategoryId),
                        token
                    );

                setProducts(data);
            }
        } catch (error) {
            console.log(
                "error al traer los productos",
                error
            );
            setProducts([]);
        } finally {
            setIsLoadingProduct(false);
        }
    }, [token, selectedCategoryId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const fetchCategories = async () => {
        if (!token) return;

        setIsLoadingCategories(true);

        try {
            const data =
                await CategoryService.getCategories(token);

            setCategories(data);
        } catch (error: any) {
            console.log(
                "Error al cargar las categories",
                error.message
            );
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // CREAR PRODUCTO
    const submitProduct = async () => {

        // NUEVO: validar todos los campos
        const errors = validateProductFields(
            getFormData()
        );

        setFieldErrors(errors);

        // Si hay errores, no enviar la solicitud
        if (Object.keys(errors).length > 0) {
            setErrorMessage(
                "Corrige los campos señalados"
            );
            return;
        }

        // VALIDAR SESIÓN
        if (!token) {
            setErrorMessage("Sesion no valida");
            return;
        }

        setErrorMessage(null);
        setIsLoadingProduct(true);

        try {
            const response =
                await ProductService.createProduct(
                    {
                        name: name.trim(),
                        categoryId: Number(categoryId),
                        sku: sku.trim(),
                        description: description.trim(),

                        regularPrice:
                            parseFloat(regularPrice),

                        offerPrice:
                            offerPrice.trim()
                                ? parseFloat(offerPrice)
                                : undefined,

                        initialStock:
                            parseInt(initialStock, 10),

                        minStockAlert:
                            minStockAlert.trim()
                                ? parseInt(minStockAlert, 10)
                                : 0
                    },
                    token
                );

            console.log("Respuesta", response);

            Alert.alert(
                "Exito",
                "Producto creado correctamente",
                [
                    {
                        text: "OK",
                        onPress: () =>
                            router.replace(
                                "/(protected)/dashboard"
                            )
                    }
                ]
            );

        } catch (error: any) {
            setErrorMessage(
                error?.message ||
                "No se pudo crear el producto"
            );
        } finally {
            setIsLoadingProduct(false);
        }
    };

    // FILTRO ORIGINAL DE PRODUCTOS
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const query =
                searchQuery.toLowerCase().trim();

            if (!query) return true;

            return (
                p.name.toLowerCase().includes(query) ||
                (
                    p.description &&
                    p.description
                        .toLowerCase()
                        .includes(query)
                )
            );
        });
    }, [products, searchQuery]);

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
        setSelectedCategoryName,
        products: filteredProducts,
        searchQuery,
        setSearchQuery,
        refreshProducts: fetchProducts,
        selectedCategoryId,
        setSelectedCategoryId,

        // NUEVAS PROPIEDADES
        fieldErrors,
        handleFieldChange,
        handleCategoryChange
    };
}
