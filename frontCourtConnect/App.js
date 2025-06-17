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
import EventFormulaire from "./ressources/screens/form/EventFormulaire";
import EventFormulaireSecondStep from "./ressources/screens/form/EventFormulaireSecondStep";

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
              <Stack.Screen name="AddEvent" component={EventFormulaire} />
              <Stack.Screen
                name="AddEventSecond"
                component={EventFormulaireSecondStep}
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
