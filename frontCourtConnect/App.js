import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeProvider, useTheme } from "./ressources/context/ThemeContext";
import AuthContext from "./ressources/context/AuthContext";

import AuthScreen from "./ressources/screens/AuthScreen";
import HomeScreen from "./ressources/screens/Home/HomeScreen";
import MapScreen from "./ressources/screens/MapScreen";
import AccountScreen from "./ressources/screens/Account/AccountScreen";
import EditProfileScreen from "./ressources/screens/Account/EditProfileScreen";
import AccountSettings from "./ressources/screens/Account/AccountSettings";
import TerrainFormulaire from "./ressources/screens/form/TerrainFormulaire";
import TerrainFormulaireSecondStep from "./ressources/screens/form/TerrainFormulaireSecondStep";
import EventFormulaire from "./ressources/screens/form/EventFormulaire";
import EventFormulaireSecondStep from "./ressources/screens/form/EventFormulaireSecondStep";
import EventDetailScreen from "./ressources/screens/detail/EventDetailScreen";
import TerrainDetailScreen from "./ressources/screens/detail/TerrainDetailScreen";
import WaitingCourtsScreen from "./ressources/screens/WaitingCourtsScreen";

import { authFetch } from "./ressources/utils/AuthFetch";


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
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Account">
                {(props) => (
                  <AccountScreen
                    {...props}
                    onLogout={() => setIsAuthenticated(false)}
                  />
                )}
              </Stack.Screen>
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
              <Stack.Screen name="EventDetail" component={EventDetailScreen} />
              <Stack.Screen
                name="TerrainDetail"
                component={TerrainDetailScreen}
              />
              <Stack.Screen
                name="WaitingCourts"
                component={WaitingCourtsScreen}
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const res = await authFetch("api/userConnected");
        if (!res.ok) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const userData = await res.json();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) return null;

  return (
    <ThemeProvider>
      <AuthContext.Provider
        value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
      >
        <AppContent
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
