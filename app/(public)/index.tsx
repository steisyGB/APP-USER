import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLogin } from "../src/auth/viewmodels/use-login";

export default function LoginScreen() {

  const router = useRouter()

  const {
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    errorMessage,
    isPasswordVisible,
    togglePasswordVisibility,
    handleLogin

  } = useLogin()


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>

            <Feather name="shopping-bag" size={25} color="#fff" />
          </View>

          <Text style={styles.appNambeLabel}>ShopEase</Text>
          <Text style={styles.WelcomeLabel}>Welcome back! Please enter your details</Text>
        </View>

        {/**card */}
        <View style={styles.card}>
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Text style={styles.label}>Email Address</Text>

          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="name@gmail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

        </View>
        <View style={styles.passwordRow}>
          <Text style={styles.label}>Password</Text>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordLabel}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={20} color="#9CAEAF" />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry={isPasswordVisible ? true : false}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
          >
            <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#9CAEAF" />

          </TouchableOpacity>
        </View>



        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
            <Text style={styles.buttonLoginText}>Log in</Text>
          </TouchableOpacity>
        )}


        <View style={styles.singUpRow}
        >
          <Text style={styles.singUpText}>
            Does not have account?
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(public)/register")}
          >
            <Text style={styles.singUpTextLink}> sing up for free</Text>
          </TouchableOpacity>

        </View>

      </View>


    </ScrollView>

    </KeyboardAvoidingView >

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24
  },
  header: {
    alignItems: "center",
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#79b479",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16
  },
  appNambeLabel: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#006C47"
  },
  WelcomeLabel: {
    fontSize: 15,
    color: "#6b7370",
    marginBottom: 25
  },
  card: {
    backgroundColor: "#FFFF",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 14,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 8,
    padding: 24,
    elevation: 2
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

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 8

  },

  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  forgotPasswordLabel: {
    color: "#006C47",
    fontWeight: "600"
  },

  buttonLogin: {
    backgroundColor: "#006C47",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 8
  },

  buttonLoginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },

  singUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35
  },

  singUpText: {
    fontSize: 14,
    color: "#6B7280"
  },

  singUpTextLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#006C47"
  },
  errorContainer: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    margin: 12,
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    marginBottom: 20,

  },

  errorText: {
    fontSize: 15,
    textAlign: "center",
    color: "#DC2626",
    fontWeight: "500"
  }

})