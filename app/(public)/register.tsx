import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRegister } from "../src/auth/viewmodels/use-register";


export default function RegisterScreen() {
    const router = useRouter();

    const {
        email,
        lastName,
        fullName,
        password,
        confirmPassword,
        phone,
        setEmail,
        setLastName,
        setFullName,
        setPassword,
        setConfirmPassword,
        setPhone,
        handleRegister,
        errorMessage,
        emailError,
        setEmailError,
        isLoading
    } = useRegister()

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={styles.cardTittle}>Create account</Text>
                    <Text style={styles.label}>Full name</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#9CA3AF" />
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="steisy"
                        />
                    </View>

                    <Text style={styles.label}>Last Name</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="phone" size={20} color="#9CA3AF" />
                        <TextInput

                            value={lastName}
                            onChangeText={setLastName}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="Benitez"
                        />
                    </View>

                    <Text style={styles.label}>Phone</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#9CA3AF" />
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="0000-0000"
                        />
                    </View>

                    <Text style={styles.label}>Email address</Text>

                    <View
                        style={[
                            styles.inputContainer,
                            emailError && styles.inputError
                        ]}
                    >
                        <Feather
                            name="mail"
                            size={20}
                            color={emailError ? "#DC2626" : "#9CA3AF"}
                        />

                        <TextInput
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text)
                                setEmailError(null)
                            }}
                            style={{
                                flex: 1,
                                height: "100%",
                                marginLeft: 8
                            }}
                            placeholder="name@user.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {emailError && (
                        <Text style={styles.emailErrorText}>
                            {emailError}
                        </Text>
                    )}


                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#9CA3AF" />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="*********"
                            secureTextEntry={true}

                        />
                    </View>

                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="shield" size={20} color="#9CA3AF" />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={{ flex: 1, height: "100%", marginLeft: 8 }}
                            placeholder="*********"
                            secureTextEntry={true}
                        />
                    </View>

                    {errorMessage && (
                        <Text
                            style={{
                                color: "red",
                                textAlign: "center",
                                marginBottom: 10
                            }}
                        >
                            {errorMessage}
                        </Text>
                    )}

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#006C47" />
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

                <View style={styles.signRow}>
                    <Text style={styles.signInText}>Already have an account ?</Text>
                    <TouchableOpacity onPress={() => router.push("/(public)")}>
                        <Text style={styles.signTextLink}> Log in here</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>

        </KeyboardAvoidingView>
    )
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
        padding: 12,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
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
    buttonRegister: {
        backgroundColor: "#006C47",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 8,
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
        borderColor: "#DC2626",
    },

    emailErrorText: {
        color: "#DC2626",
        fontSize: 13,
        marginTop: -10,
        marginBottom: 15,
        marginLeft: 4,
    },


})