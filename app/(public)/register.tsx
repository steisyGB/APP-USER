
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { useRegister } from "../src/auth/viewmodels/use-register";

export default function RegisterScreen() {
    const router = useRouter();

    // Mostrar y ocultar contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        email,
        lastName,
        fullName,
        password,
        confirmPassword,
        phone,
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
    } = useRegister();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>

                    <Text style={styles.cardTittle}>
                        Create account
                    </Text>

                    {/* NOMBRE */}
                    <Text style={styles.label}>Full name</Text>

                    <View
                        style={[
                            styles.inputContainer,
                            fieldErrors.fullName && styles.inputError
                        ]}
                    >
                        <Feather
                            name="user"
                            size={20}
                            color={
                                fieldErrors.fullName
                                    ? "#DC2626"
                                    : "#9CA3AF"
                            }
                        />

                        <TextInput
                            value={fullName}
                            onChangeText={(value) =>
                                onTextField("fullName", value)
                            }
                            style={styles.textInput}
                            placeholder="Steisy"
                            autoCapitalize="words"
                        />
                    </View>

                    {fieldErrors.fullName ? (
                        <Text style={styles.emailErrorText}>
                            {fieldErrors.fullName}
                        </Text>
                    ) : null}

                    {/* APELLIDO */}
                    <Text style={styles.label}>Last Name</Text>

                    <View
                        style={[
                            styles.inputContainer,
                            fieldErrors.lastName && styles.inputError
                        ]}
                    >
                        <Feather
                            name="user"
                            size={20}
                            color={
                                fieldErrors.lastName
                                    ? "#DC2626"
                                    : "#9CA3AF"
                            }
                        />

                        <TextInput
                            value={lastName}
                            onChangeText={(value) =>
                                onTextField("lastName", value)
                            }
                            style={styles.textInput}
                            placeholder="Benítez"
                            autoCapitalize="words"
                        />
                    </View>

                    {fieldErrors.lastName ? (
                        <Text style={styles.emailErrorText}>
                            {fieldErrors.lastName}
                        </Text>
                    ) : null}

                    {/* TELÉFONO */}
                    <Text style={styles.label}>Phone</Text>

                    <View
                        style={[
                            styles.inputContainer,
                            fieldErrors.phone && styles.inputError
                        ]}
                    >
                        <Feather
                            name="phone"
                            size={20}
                            color={
                                fieldErrors.phone
                                    ? "#DC2626"
                                    : "#9CA3AF"
                            }
                        />

                        <TextInput
                            value={phone}
                            onChangeText={onPhoneField}
                            style={styles.textInput}
                            placeholder="0000-0000"
                            keyboardType="phone-pad"
                            maxLength={9}
                        />
                    </View>

                    {fieldErrors.phone ? (
                        <Text style={styles.emailErrorText}>
                            {fieldErrors.phone}
                        </Text>
                    ) : null}

                    {/* CORREO ELECTRÓNICO */}
                    <Text style={styles.label}>
                        Email address
                    </Text>

                    <View
                        style={[
                            styles.inputContainer,
                            (emailError || fieldErrors.email) &&
                                styles.inputError
                        ]}
                    >
                        <Feather
                            name="mail"
                            size={20}
                            color={
                                emailError || fieldErrors.email
                                    ? "#DC2626"
                                    : "#9CA3AF"
                            }
                        />

                        <TextInput
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setEmailError(null);
                            }}
                            style={styles.textInput}
                            placeholder="name@user.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {emailError || fieldErrors.email ? (
                        <Text style={styles.emailErrorText}>
                            {emailError || fieldErrors.email}
                        </Text>
                    ) : null}

                    {/* CONTRASEÑA */}
                    <Text style={styles.label}>Password</Text>

                    <View
                        style={[
                            styles.inputContainer,
                            fieldErrors.password && styles.inputError
                        ]}
                    >
                        <Feather
                            name="lock"
                            size={20}
                            color={
                                fieldErrors.password
                                    ? "#DC2626"
                                    : "#9CA3AF"
                            }
                        />

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={styles.textInput}
                            placeholder="********"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <TouchableOpacity
                            onPress={() =>
                                setShowPassword(!showPassword)
                            }
                            style={styles.eyeButton}
                            accessibilityRole="button"
                            accessibilityLabel={
                                showPassword
                                    ? "Ocultar contraseña"
                                    : "Mostrar contraseña"
                            }
                        >
                            <Feather
                                name={
                                    showPassword
                                        ? "eye-off"
                                        : "eye"
                                }
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    {fieldErrors.password ? (
                        <Text style={styles.emailErrorText}>
                            {fieldErrors.password}
                        </Text>
                    ) : null}

                    {/* CONFIRMAR CONTRASEÑA */}
                    <Text style={styles.label}>
                        Confirm Password
                    </Text>

                    <View
                        style={[
                            styles.inputContainer,
                            fieldErrors.confirmPassword &&
                                styles.inputError
                        ]}
                    >
                        <Feather
                            name="shield"
                            size={20}
                            color={
                                fieldErrors.confirmPassword
                                    ? "#DC2626"
                                    : "#9CA3AF"
                            }
                        />

                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.textInput}
                            placeholder="********"
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <TouchableOpacity
                            onPress={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            style={styles.eyeButton}
                            accessibilityRole="button"
                            accessibilityLabel={
                                showConfirmPassword
                                    ? "Ocultar confirmación"
                                    : "Mostrar confirmación"
                            }
                        >
                            <Feather
                                name={
                                    showConfirmPassword
                                        ? "eye-off"
                                        : "eye"
                                }
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    {fieldErrors.confirmPassword ? (
                        <Text style={styles.emailErrorText}>
                            {fieldErrors.confirmPassword}
                        </Text>
                    ) : null}

                    {/* ERROR GENERAL */}
                    {errorMessage ? (
                        <Text style={styles.generalErrorText}>
                            {errorMessage}
                        </Text>
                    ) : null}

                    {/* BOTÓN DE REGISTRO */}
                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color="#006C47"
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.buttonRegister}
                            onPress={handleRegister}
                        >
                            <Text style={styles.buttonRegisterText}>
                                Register
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ENLACE A INICIO DE SESIÓN */}
                <View style={styles.signRow}>
                    <Text style={styles.signInText}>
                        Already have an account ?
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push("/(public)")}
                    >
                        <Text style={styles.signTextLink}>
                            {" "}Log in here
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },

    scrollContainer: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
        paddingTop: 40
    },

    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 12,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2
    },

    cardTittle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1F2937",
        textAlign: "center",
        marginBottom: 20
    },

    label: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 10
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 15,
        height: 50
    },

    textInput: {
        flex: 1,
        height: "100%",
        marginLeft: 8,
        color: "#1F2937",
        fontSize: 14
    },

    eyeButton: {
        padding: 8,
        justifyContent: "center",
        alignItems: "center"
    },

    buttonRegister: {
        backgroundColor: "#006C47",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 8
    },

    buttonRegisterText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },

    signRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20
    },

    signInText: {
        fontSize: 14,
        color: "#6B7280"
    },

    signTextLink: {
        fontSize: 14,
        color: "#006C47",
        fontWeight: "bold"
    },

    inputError: {
        borderColor: "#DC2626"
    },

    emailErrorText: {
        color: "#DC2626",
        fontSize: 13,
        marginTop: -10,
        marginBottom: 15,
        marginLeft: 4
    },

    generalErrorText: {
        color: "#DC2626",
        textAlign: "center",
        fontSize: 13,
        marginBottom: 15
    }
});
