
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    View,
    TextInput,
    Alert,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/context/AuthContext";
import { useEffect, useState } from "react";
import { AuthService } from "../src/auth/services/auth.services";

import {
    textFieldError,
    phoneFieldError
} from "../src/Validation/fields";

type ProfileField = "name" | "lastname" | "phone";

type ProfileErrors = Record<ProfileField, string>;

const emptyErrors: ProfileErrors = {
    name: "",
    lastname: "",
    phone: ""
};

export default function ProfileScreen() {
    const router = useRouter();
    const { user, token, updateUserSession } = useAuth();

    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const [fieldErrors, setFieldErrors] =
        useState<ProfileErrors>({ ...emptyErrors });

    // Cargar información del usuario
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setLastname(user.lastName || "");
            setPhone(user.phone || "");
            setFieldErrors({ ...emptyErrors });
        }
    }, [user]);

    // Validar cada campo
    const validateField = (
        field: ProfileField,
        value: string
    ): string => {
        if (field === "name") {
            return textFieldError(value, "Nombre") || "";
        }

        if (field === "lastname") {
            return textFieldError(value, "Apellido") || "";
        }

        return phoneFieldError(value) || "";
    };

    // Actualizar y validar mientras se escribe
    const handleFieldChange = (
        field: ProfileField,
        value: string
    ) => {
        const message = validateField(field, value);

        setFieldErrors(prev => ({
            ...prev,
            [field]: message
        }));

        switch (field) {
            case "name":
                setName(value);
                break;

            case "lastname":
                setLastname(value);
                break;

            case "phone":
                setPhone(value);
                break;
        }
    };

    // Guardar cambios
    const handleUpdateUser = async () => {
        const errors: ProfileErrors = {
            name: validateField("name", name),
            lastname: validateField("lastname", lastname),
            phone: validateField("phone", phone)
        };

        setFieldErrors(errors);

        // No actualizar con datos inválidos
        const firstError =
            errors.name ||
            errors.lastname ||
            errors.phone;

        if (firstError) {
            Alert.alert(
                "Datos inválidos",
                firstError
            );
            return;
        }

        // Validar sesión
        if (!user?.id || !token) {
            Alert.alert(
                "Error de sesión",
                "No se encontró el usuario"
            );
            return;
        }

        setIsUpdating(true);

        try {
            const updateUser =
                await AuthService.updateUser(
                    user.id,
                    name.trim(),
                    lastname.trim(),
                    phone.replace(/[ -]/g, ""),
                    token
                );

            await updateUserSession(updateUser);

            setFieldErrors({ ...emptyErrors });

            Alert.alert(
                "Excelente",
                "Tu información ha sido actualizada con éxito en el servidor"
            );

            

        } catch (error: any) {
            Alert.alert(
                "Error al actualizar",
                error.message || "No se pudo actualizar"
            );
        } finally {
            setIsUpdating(false);
        }

    };


    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen
                options={{ headerShown: false }}
            />

            {/* ENCABEZADO */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() =>
                        router.replace(
                            "/(protected)/dashboard"
                        )
                    }
                >
                    <Ionicons
                        name="arrow-back-outline"
                        size={26}
                    />
                </TouchableOpacity>

                <Text style={styles.logoText}>
                    ShopEase
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
            >
                {/* TARJETA DE PERFIL */}
                <View style={styles.profileCard}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{
                                uri: "https://i.pinimg.com/originals/e4/07/76/e40776fada2b13fcec1cd9fdefb34af0.png"
                            }}
                            style={styles.profileAvatar}
                        />

                        <TouchableOpacity
                            style={styles.cameraBtn}
                        >
                            <Ionicons
                                name="camera"
                                size={16}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.profileName}>
                        Steisy Gissel Benitez Machado
                    </Text>

                    <Text style={styles.profileSubtitle}>
                        Full Stack Developer
                    </Text>

                    {/* TARJETAS DE PUNTOS */}
                    <View style={styles.cardPoints}>
                        <View
                            style={[
                                styles.cardPointBox,
                                styles.cardOrderColor
                            ]}
                        >
                            <Text style={styles.cardBoxLabel}>
                                Orders
                            </Text>
                            <Text style={styles.cardBoxValue}>
                                24
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.cardPointBox,
                                styles.cardPointsColor
                            ]}
                        >
                            <Text style={styles.cardBoxLabel}>
                                Points
                            </Text>
                            <Text style={styles.cardBoxValue}>
                                1,250
                            </Text>
                        </View>
                    </View>
                </View>

                {/* INFORMACIÓN PERSONAL */}
                <View style={styles.sectionCard}>
                    <Text style={styles.personalHeader}>
                        personal information
                    </Text>

                    {/* NOMBRE */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>
                            NAME
                        </Text>

                        <View
                            style={[
                                styles.inputWrapper,
                                fieldErrors.name &&
                                    styles.inputError
                            ]}
                        >
                            <Ionicons
                                style={styles.inputIcon}
                                name="person-outline"
                                size={20}
                                color={
                                    fieldErrors.name
                                        ? "#DC2626"
                                        : "#6B7280"
                                }
                            />

                            <TextInput
                                placeholder="Full name"
                                style={styles.input}
                                value={name}
                                onChangeText={(value) =>
                                    handleFieldChange(
                                        "name",
                                        value
                                    )
                                }
                                autoCapitalize="words"
                            />
                        </View>

                        {fieldErrors.name ? (
                            <Text style={styles.errorText}>
                                {fieldErrors.name}
                            </Text>
                        ) : null}
                    </View>

                    {/* APELLIDO */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>
                            LAST NAME
                        </Text>

                        <View
                            style={[
                                styles.inputWrapper,
                                fieldErrors.lastname &&
                                    styles.inputError
                            ]}
                        >
                            <Ionicons
                                style={styles.inputIcon}
                                name="person-outline"
                                size={20}
                                color={
                                    fieldErrors.lastname
                                        ? "#DC2626"
                                        : "#6B7280"
                                }
                            />

                            <TextInput
                                placeholder="Last name"
                                style={styles.input}
                                value={lastname}
                                onChangeText={(value) =>
                                    handleFieldChange(
                                        "lastname",
                                        value
                                    )
                                }
                                autoCapitalize="words"
                            />
                        </View>

                        {fieldErrors.lastname ? (
                            <Text style={styles.errorText}>
                                {fieldErrors.lastname}
                            </Text>
                        ) : null}
                    </View>

                    {/* TELÉFONO */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>
                            PHONE NUMBER
                        </Text>

                        <View
                            style={[
                                styles.inputWrapper,
                                fieldErrors.phone &&
                                    styles.inputError
                            ]}
                        >
                            <Ionicons
                                style={styles.inputIcon}
                                name="call-outline"
                                size={20}
                                color={
                                    fieldErrors.phone
                                        ? "#DC2626"
                                        : "#6B7280"
                                }
                            />

                            <TextInput
                                placeholder="0000-0000"
                                keyboardType="phone-pad"
                                maxLength={9}
                                style={styles.input}
                                value={phone}
                                onChangeText={(value) =>
                                    handleFieldChange(
                                        "phone",
                                        value
                                    )
                                }
                            />
                        </View>

                        {fieldErrors.phone ? (
                            <Text style={styles.errorText}>
                                {fieldErrors.phone}
                            </Text>
                        ) : null}
                    </View>

                    {/* BOTÓN DE GUARDAR */}
                    <View>
                        <TouchableOpacity
                            style={[
                                styles.updateButton,
                                isUpdating &&
                                    styles.buttonDisabled
                            ]}
                            onPress={handleUpdateUser}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <ActivityIndicator
                                    color="#FFF"
                                    size="small"
                                />
                            ) : (
                                <>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={20}
                                        color="#FFF"
                                        style={{
                                            marginRight: 8
                                        }}
                                    />

                                    <Text
                                        style={
                                            styles.updateButtonText
                                        }
                                    >
                                        Save Changes
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6"
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#F3F4F6"
    },

    logoText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#005C3A"
    },

    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40
    },

    profileCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },

    imageWrapper: {
        position: "relative",
        marginBottom: 20
    },

    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50
    },

    cameraBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#005C3A",
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#FFF"
    },

    profileName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4
    },

    profileSubtitle: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 20
    },

    cardPoints: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
    },

    cardPointBox: {
        flex: 1,
        height: 64,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6
    },

    cardOrderColor: {
        backgroundColor: "#DBEAFE"
    },

    cardPointsColor: {
        backgroundColor: "#E2F0FC"
    },

    cardBoxLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4B5563",
        letterSpacing: 1,
        marginBottom: 4
    },

    cardBoxValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#047857"
    },

    sectionCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2
    },

    personalHeader: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 18
    },

    inputGroup: {
        marginBottom: 14
    },

    inputLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4B5563",
        letterSpacing: 1,
        marginBottom: 6
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: "#FFF"
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: "#1F2937",
        paddingVertical: 0
    },

    inputIcon: {
        marginRight: 10
    },

    inputError: {
        borderColor: "#DC2626"
    },

    errorText: {
        color: "#DC2626",
        fontSize: 12,
        marginTop: 5,
        marginLeft: 4
    },

    updateButton: {
        flexDirection: "row",
        backgroundColor: "#005C3A",
        borderRadius: 12,
        height: 48,
        alignItems: "center",
        justifyContent: "center"
    },

    buttonDisabled: {
        opacity: 0.6
    },

    updateButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold"
    }
});
