import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-5xl font-sans-extrabold">Home</Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary font-sans-bold p-4 text-white"
      >
        Go to Onboarding
      </Link>
      <Link href="/sign-in" className="mt-4 rounded bg-primary text-white font-sans-bold p-4 ">
        Sign In
      </Link>
      <Link href="/sign-up" className="mt-4 rounded bg-primary text-white font-sans-bold p-4">
        Sign Up
      </Link>
    </SafeAreaView>
  );
}
