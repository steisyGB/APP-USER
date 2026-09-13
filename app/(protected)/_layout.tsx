import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDrawer } from "../src/admin/viewmodels/use-drawer";
import { useAuth } from "../src/context/AuthContext";
export default function ProtectedLayout() {
    const { profile, navigationOptions } = useDrawer()
    const{clearSession}=useAuth()
    return (
        <GestureHandlerRootView>
            <Drawer screenOptions={{
                headerTintColor: "#006C47"
            }}
                drawerContent={(props) => {
                    const activeIndex = props.state.index
                    const activeRouteName = props.state.routeNames[activeIndex]

                    return (
                        <View style={styles.drawerContainer}>
                            <View style={styles.header}>
                                <View style={styles.headerInfoUser}>
                                    <Image style={styles.avatar}
                                        source={{ uri: profile.avatarUrl }}

                                    />

                                    <View style={styles.headerInfo}>
                                        <Text style={styles.adminName}>{profile.name}</Text>
                                        <Text style={styles.adminRole}>{profile.role}</Text>
                                    </View>

                                </View>

                                <View style={styles.versionTag}>
                                    <Text>{profile.version}</Text>
                                </View>

                            </View>

                            <View style={styles.menuList}>
                                {navigationOptions.map((option) => {

                                    const isSelected = activeRouteName === option.name;

                                    return (
                                        <TouchableOpacity
                                            key={option.name}
                                            style={[
                                                styles.menuItemList,
                                                isSelected && styles.menuItemSelected
                                            ]}
                                        >

                                            <Feather
                                                name={option.icon as any}
                                                size={20}
                                                color={isSelected ? "#FFF" : "#374151"}
                                                style={styles.menuIcon}
                                            />

                                            <Text
                                                style={[
                                                    styles.menuText,
                                                    isSelected && styles.menuTextSelected
                                                ]}
                                            >
                                                {option.label}
                                            </Text>

                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={async () => {
                                    await clearSession();
                                }}
                            >
                                <Feather name="log-out" size={20} color="#EF4444" style={styles.menuIcon} />
                                <Text style={styles.logoutText}>Log Out</Text>

                            </TouchableOpacity>
                        </View>
                    )
                }}
            />

        </GestureHandlerRootView>
    );
}


const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        paddingTop: 50
    },
    header: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        alignItems: "flex-start"
    },
    headerInfoUser: {
        flexDirection: "row"
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 30
    },
    headerInfo: {
        marginLeft: 15,
        marginTop: 5
    },
    adminName: {
        fontSize: 20,
        color: "#006C47",
        fontWeight: "bold"
    },
    adminRole: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#6b7280"
    },

    versionTag: {
        borderWidth: 1,
        paddingHorizontal: 8,
        borderColor: "#D1D5DB",
        paddingVertical: 2,
        marginTop: 8,
        borderRadius: 12

    },

    menuList: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 12
    },
    menuItemList: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 24,
        marginVertical: 4
    },
    menuItemSelected: {
        backgroundColor: "#00B074"
    },
    menuIcon: {
        marginRight: 15
    },

    menuText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#374151"
    },
    menuTextSelected: {
        color: "#FFF"
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        marginBottom: 15
    },
    logoutText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#EF4444"
    }



})