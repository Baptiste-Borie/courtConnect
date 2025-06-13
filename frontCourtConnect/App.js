import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthScreen from "./ressources/screens/AuthScreen";
import HomeScreen from "./ressources/screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkToken();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen
                {...props}
                onLogout={() => setIsAuthenticated(false)}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {(props) => (
              <AuthScreen {...props} onLogin={() => setIsAuthenticated(true)} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
