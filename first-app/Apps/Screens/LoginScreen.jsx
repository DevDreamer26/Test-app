import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {

  useWarmUpBrowser();
 
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
 
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View>
      <Image
        source={require("../../assets/images/login.jpg")}
        className="w-full h-[400px] object-cover"
      />
      <View className="p-5 bg-cyan-100 mt-[-20px] rounded-t-3xl">
        <Text className="text-[30px] font-bold text-blue-800">
         Healthify - by Gigcrafters
        </Text>
        <Text className="text-[18px] text-slate-500 mt-6">
        Bringing Health and Happiness to Every Corner.
        </Text>
        <TouchableOpacity onPress={onPress} className=" p-4 bg-blue-500 rounded-full mt-20">
            <Text className="text-white text-center text-[22px]">
                Get started
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
