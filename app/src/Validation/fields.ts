export const onlyNames = (value: string): boolean => {
    return /^[\p{L}\p{M} '\-]+$/u.test(value.trim());
};

export const onlyPhone = (value: string): boolean => {
    return /^\d{8}$/.test(value.replace(/[ -]/g, ""));
};

export const validEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const validMoney = (value: string): boolean => {
    return /^\d+(?:\.\d{1,2})?$/.test(value.trim())
        && Number(value) >= 0;
};

export const validStock = (value: string): boolean => {
    return /^\d+$/.test(value.trim());
};

export function textFieldError(
    value: string,
    label: string
): string | null {
    if (!value.trim()) {
        return `El campo ${label} es obligatorio`;
    }

    if (!onlyNames(value)) {
        return `${label} solo permite letras, espacios  y guiones. no números`;
    }

    return null;
}

export function phoneFieldError(
    value: string
): string | null {
    if (!value.trim()) {
        return "El teléfono es obligatorio";
    }

    if (!onlyPhone(value)) {
        return "El teléfono debe contener exactamente 8 números";
    }

    return null;
}

// VALIDACIONES DE PRODUCTOS

export type ProductField =
    | "name"
    | "categoryId"
    | "sku"
    | "regularPrice"
    | "offerPrice"
    | "initialStock"
    | "minStockAlert";

export type ProductFieldErrors =
    Partial<Record<ProductField, string>>;

export type ProductValidationData = {
    name: string;
    categoryId: number | null;
    sku: string;
    regularPrice: string;
    offerPrice: string;
    initialStock: string;
    minStockAlert: string;
};

export function validateProductFields(
    data: ProductValidationData
): ProductFieldErrors {
    const errors: ProductFieldErrors = {};

    if (!data.name.trim()) {
        errors.name = "El nombre es obligatorio";
    } else if (data.name.trim().length < 2) {
        errors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (
        data.categoryId === null ||
        !Number.isInteger(data.categoryId) ||
        data.categoryId <= 0
    ) {
        errors.categoryId = "Selecciona una categoría";
    }

    if (!data.sku.trim()) {
        errors.sku = "El código SKU es obligatorio";
    }

    if (!data.regularPrice.trim()) {
        errors.regularPrice = "El precio regular es obligatorio";
    } else if (!validMoney(data.regularPrice)) {
        errors.regularPrice =
            "Ingresa un precio válido, máximo 2 decimales";
    } else if (Number(data.regularPrice) <= 0) {
        errors.regularPrice =
            "El precio regular debe ser mayor que cero";
    }

    if (data.offerPrice.trim()) {
        if (!validMoney(data.offerPrice)) {
            errors.offerPrice =
                "Ingresa un precio de oferta válido";
        } else if (Number(data.offerPrice) <= 0) {
            errors.offerPrice =
                "El precio de oferta debe ser mayor que cero";
        } else if (
            validMoney(data.regularPrice) &&
            Number(data.offerPrice) >
            Number(data.regularPrice)
        ) {
            errors.offerPrice =
                "La oferta no puede superar el precio regular";
        }
    }

    if (!data.initialStock.trim()) {
        errors.initialStock = "El stock inicial es obligatorio";
    } else if (!validStock(data.initialStock)) {
        errors.initialStock =
            "El stock debe ser un número entero no negativo";
    }

    if (
        data.minStockAlert.trim() &&
        !validStock(data.minStockAlert)
    ) {
        errors.minStockAlert =
            "El stock mínimo debe ser un número entero no negativo";
    }

    return errors;
}



export type CategoryFieldErrors = {
    name?: string;
    description?: string;
};

export function validateCategoryFields(
    name: string,
    description: string
): CategoryFieldErrors {
    const errors: CategoryFieldErrors = {};

    // Validar nombre de categoría
    if (!name.trim()) {
        errors.name = "El nombre de la categoría es obligatorio";
    } else if (name.trim().length < 2) {
        errors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (!onlyNames(name)) {
        errors.name = "El nombre solo permite letras, espacios y guiones; no números";
    }

    // Validar descripción
    if (!description.trim()) {
        errors.description = "La descripción es obligatoria";
    } else if (description.trim().length < 5) {
        errors.description = "La descripción debe tener al menos 5 caracteres";
    }

    return errors;
}

