import { useRouter } from "expo-router";
import { useState } from "react";
import { AdminProfile, DrawerItemOption } from "../models/drawer.model";

export function useDrawer() {
    const router = useRouter()

    const [profile] = useState<AdminProfile>({
        name: "Admin User",
        role: "System managment",
        avatarUrl: "https://i.pinimg.com/originals/e4/07/76/e40776fada2b13fcec1cd9fdefb34af0.png",
        version: "v4.4.4"
    })

    const navigationOptions: DrawerItemOption[] = [
        {
            name: "dashboard",
            label: "Dashboard",
            icon: "grid"
        },
        {
            name: "orders",
            label: "Orders",
            icon: "package"
        },
        {
            name: "inventory",
            label: "Inventory",
            icon: "archive",
            subitems: [
                {
                    name: "inventory",
                    label: "Categories",
                    icon: "folder"
                },
                {
                    name: "create-product",
                    label: "Products",
                    icon: "file-text"
                }
            ]
        }
    ]

    return {
        profile,
        navigationOptions
    }
}
