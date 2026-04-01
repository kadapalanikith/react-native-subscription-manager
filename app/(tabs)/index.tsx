import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from "nativewind";
const SafeAreaView = styled(RNSafeAreaView);


export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">Home Screen</Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-primary p-4 text-background"
      >
        Go to Onboarding
      </Link>
      <Link href="/sign-in" className="mt-4 rounded bg-accent p-4 text-primary">
        Sign In
      </Link>
      <Link href="/sign-up" className="mt-4 rounded bg-accent p-4 text-primary">
        Sign Up
      </Link>

      <Link href="/subscriptions/spotify">Spotify Sub</Link>
      <Link
        href={{
          pathname: "/subscriptions",
        }}
      >
        Apple Music Sub
      </Link>
    </SafeAreaView>
  );
}
