
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import {
    Alert,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ProductItem } from "../src/Products/models/product.model";

export default function ProductDetailScreen() {
    const router = useRouter();

    const { product: productParam } = useLocalSearchParams<{
        product?: string;
    }>();

    //PRODUCTO
    let product: ProductItem | null = null;

    try {
        if (typeof productParam === "string") {
            const parsed = JSON.parse(productParam);

            if (
                parsed &&
                typeof parsed.id === "number" &&
                typeof parsed.name === "string" &&
                typeof parsed.regularPrice === "number"
            ) {
                product = parsed as ProductItem;
            }
        }
    } catch (error) {
        console.log("Error al leer producto:", error);
    }

    // PRODUCTO NO DISPONIBLE
    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <Drawer.Screen options={{ headerShown: false }} />

                <View style={styles.errorContainer}>
                    <Text>Producto no disponible</Text>

                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backLink}>
                            Regresar
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // DATOS REALES DEL PRODUCTO
    const regularPrice = product.regularPrice;

    const hasOffer =
        typeof product.offerPrice === "number" &&
        product.offerPrice >= 0 &&
        product.offerPrice < regularPrice;

    const currentPrice = hasOffer
        ? product.offerPrice!
        : regularPrice;

    // CALCULAR DESCUENTO
    const discount = hasOffer && regularPrice > 0
        ? Math.round(
            ((regularPrice - currentPrice) / regularPrice) * 100
        )
        : 0;
    //STOCK
    const initialStock = product.initialStock;

    const hasStockData =
        typeof initialStock === "number" &&
        Number.isFinite(initialStock);

    // COMPARTIR PRODUCTO
    const handleShare = async () => {
        try {
            await Share.share({
                message:
                    `${product.name}\n` +
                    `${product.description ?? ""}\n` +
                    `Precio: $${currentPrice.toFixed(2)}\n` +
                    `Disponible en ShopEase`
            });
        } catch (error) {
            Alert.alert(
                "Error",
                "No se pudo compartir el producto"
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* HEADER SUPERIOR */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="arrow-back-outline"
                            size={26}
                            color="#1F2937"
                        />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerCategory}>
                            {product.categoryName || "Productos"}
                        </Text>

                        <Text style={styles.headerLogo}>
                            ShopEase
                        </Text>
                    </View>

                    <View style={styles.headerSpacer} />
                </View>

                {/* TARJETA DEL PRODUCTO */}
                <View style={styles.productCard}>
                    <View style={styles.imageContainer}>

                        {/* IMAGEN REAL DEL PRODUCTO */}
                        {product.imageUrl ? (
                            <Image
                                source={{ uri: product.imageUrl }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.noImage}>
                                <Ionicons
                                    name="image-outline"
                                    size={54}
                                    color="#9CA3AF"
                                />

                                <Text style={styles.noImageText}>
                                    Sin imagen
                                </Text>
                            </View>
                        )}

                        {/* ETIQUETAS FLOTANTES */}
                        <View style={styles.leftBadges}>

                            {/* DESCUENTO CALCULADO DESDE LA API */}
                            {hasOffer && (
                                <View style={styles.discountBadge}>
                                    <Ionicons
                                        name="flash-outline"
                                        size={15}
                                        color="#FFFFFF"
                                    />

                                    <Text style={styles.discountText}>
                                        -{discount}% OFF
                                    </Text>
                                </View>
                            )}

                            {/* INSIGNIA */}
                            <View style={styles.officialBadge}>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={15}
                                    color="#006C47"
                                />

                                <Text style={styles.officialText}>
                                    Oficial
                                </Text>
                            </View>
                        </View>

                        {/* BOTÓN COMPARTIR */}
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={handleShare}
                        >
                            <Ionicons
                                name="share-social-outline"
                                size={21}
                                color="#52645F"
                            />
                        </TouchableOpacity>

                    </View>
                </View>

                {/* INFORMACIÓN DEL PRODUCTO */}
                <View style={styles.productInformation}>

                    {/* STOCK REAL DE LA API */}
                    <View style={styles.stockBadge}>
                        <View style={styles.stockDot} />

                        <Text style={styles.stockText}>
                            {hasStockData
                                ? initialStock > 0
                                    ? `En Stock (${initialStock} disponibles)`
                                    : "Agotado (0 disponibles)"
                                : "Stock no disponible"}
                        </Text>
                    </View>

                    {/* ENVÍO HARDCODEADO */}
                    <View style={styles.shippingBadge}>
                        <MaterialIcons
                            name="two-wheeler"
                            size={17}
                            color="#64748B"
                        />

                        <Text style={styles.shippingText}>
                            Envío Motorizado Hoy
                        </Text>
                    </View>

                    {/* NOMBRE REAL DEL PRODUCTO */}
                    <Text style={styles.productTitle}>
                        {product.name}
                    </Text>

                    {/* PRECIOS REALES DEL PRODUCTO */}
                    <View style={styles.priceCard}>

                        <Text style={styles.currentPrice}>
                            ${currentPrice.toFixed(2)}
                        </Text>

                        {hasOffer && (
                            <Text style={styles.originalPrice}>
                                ${regularPrice.toFixed(2)}
                            </Text>
                        )}

                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },

    scrollContent: {
        paddingBottom: 30
    },

    // HEADER
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 12
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "flex-start"
    },

    headerCenter: {
        flex: 1,
        alignItems: "center"
    },

    headerCategory: {
        fontSize: 12,
        fontWeight: "600",
        color: "#52615B"
    },

    headerLogo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#006C47",
        marginTop: 2
    },

    headerSpacer: {
        width: 40
    },

    // TARJETA PRINCIPAL
    productCard: {
        marginHorizontal: 14,
        marginTop: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 14,
        paddingBottom: 22,
        elevation: 4,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.08,
        shadowRadius: 10
    },

    // IMAGEN
    imageContainer: {
        width: "100%",
        height: 340,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#E5E7EB"
    },

    productImage: {
        width: "100%",
        height: "100%"
    },

    noImage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    noImageText: {
        color: "#9CA3AF",
        marginTop: 8
    },

    // ETIQUETAS FLOTANTES
    leftBadges: {
        position: "absolute",
        top: 12,
        left: 12,
        alignItems: "flex-start"
    },

    // DESCUENTO
    discountBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#10B981",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 5
    },

    discountText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold"
    },

    // INSIGNIA
    officialBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 6,
        gap: 5
    },

    officialText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#006C47"
    },

    // BOTÓN COMPARTIR
    shareButton: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 2
    },

    // INFORMACIÓN DEL PRODUCTO
    productInformation: {
        paddingHorizontal: 28,
        paddingTop: 24
    },

    // STOCK
    stockBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#A7F3D0",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 5
    },

    stockDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#006C47"
    },

    stockText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#065F46"
    },

    // ENVÍO MOTORIZADO
    shippingBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#DBEAFE",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 7,
        gap: 5
    },

    shippingText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B"
    },

    // TÍTULO DEL PRODUCTO
    productTitle: {
        fontSize: 27,
        fontWeight: "bold",
        color: "#202124",
        lineHeight: 34,
        marginTop: 18,
        marginBottom: 24
    },

    // TARJETA DE PRECIOS
    priceCard: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 13,
        paddingHorizontal: 16,
        paddingVertical: 18,
        gap: 10,
        elevation: 1
    },

    currentPrice: {
        fontSize: 39,
        fontWeight: "bold",
        color: "#006C47"
    },

    originalPrice: {
        fontSize: 15,
        color: "#84918B",
        textDecorationLine: "line-through"
    },

    // PRODUCTO NO DISPONIBLE
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16
    },

    backLink: {
        color: "#006C47",
        fontWeight: "bold"
    }
});
