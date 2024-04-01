import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import LoginScreen from "./Apps/Screens/LoginScreen";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./Apps/Navigations/TabNavigation";

export default function App() {
  return (
    <ClerkProvider publishableKey="pk_test_bm9ibGUtZm94aG91bmQtOTcuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <View className="flex-1  bg-white">
        <StatusBar style="auto" />
        <SignedIn>
          {/* <Text className="mt-10">You are Signed in</Text> */}
        </SignedIn>
        <SignedOut>
          {/* <LoginScreen/> */}
          <NavigationContainer>
            <TabNavigation />
          </NavigationContainer>
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}

