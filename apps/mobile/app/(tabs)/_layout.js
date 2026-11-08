import { Pressable } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

function BoutonAjouter() {
  const { session } = useAuth();
  const router = useRouter();

  if (!session) {
    return null;
  }

  return (
    <Pressable onPress={() => router.push("/nouveau")} style={{ marginRight: 16 }}>
      <Ionicons name="add-circle" size={28} color="#fff" />
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#1a3a5c" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#ea7d2b",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Evenements",
          headerRight: () => <BoutonAjouter />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
