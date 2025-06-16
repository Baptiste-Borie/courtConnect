import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeProvider, useTheme } from "./ressources/context/ThemeContext";
import AuthContext from "./ressources/context/AuthContext";

import AuthScreen from "./ressources/screens/AuthScreen";
import HomeScreen from "./ressources/screens/HomeScreen";
import MapScreen from "./ressources/screens/MapScreen";
import AccountScreen from "./ressources/screens/Account/AccountScreen";
import EditProfileScreen from "./ressources/screens/Account/EditProfileScreen";
import AccountSettings from "./ressources/screens/Account/AccountSettings";
import TerrainFormulaire from "./ressources/screens/form/TerrainFormulaire";
import TerrainFormulaireSecondStep from "./ressources/screens/form/TerrainFormulaireSecondStep";

const Stack = createNativeStackNavigator();

function AppContent({ isAuthenticated, setIsAuthenticated }) {
  const { theme, themeName } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={themeName === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Map" component={MapScreen} />
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Home">
                {(props) => (
                  <HomeScreen
                    {...props}
                    onLogout={() => setIsAuthenticated(false)}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Account" component={AccountScreen} />
              <Stack.Screen name="EditAccount" component={EditProfileScreen} />
              <Stack.Screen
                name="AccountSettings"
                component={AccountSettings}
              />
              <Stack.Screen name="AddTerrain" component={TerrainFormulaire} />
              <Stack.Screen
                name="AddTerrainSecond"
                component={TerrainFormulaireSecondStep}
              />
            </>
          ) : (
            <Stack.Screen name="Auth">
              {(props) => (
                <AuthScreen
                  {...props}
                  onLogin={() => setIsAuthenticated(true)}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// Fonction simple pour vérifier si un token est expiré
const isTokenExpired = (token) => {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true);
      } else if (refreshToken) {
        try {
          const response = await fetch("https://ton-api.com/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (!response.ok) throw new Error("Refresh token invalide");

          const data = await response.json();
          await AsyncStorage.setItem("token", data.token);
          await AsyncStorage.setItem("refresh_token", data.refresh_token);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Erreur lors du refresh :", error);
          await AsyncStorage.multiRemove(["token", "refresh_token"]);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkToken();
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <AppContent
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
