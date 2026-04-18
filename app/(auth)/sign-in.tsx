import { useSignIn, useAuth } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInScreen() {
  const { isLoaded } = useAuth();
  const { signIn } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || !signIn) return;
    setLocalError("");
    setIsPending(true);

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        setLocalError(
          error.longMessage || 
          error.message ||
          "An error occurred during sign in."
        );
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: () => router.replace("/(tabs)"),
        });
      } else {
        setLocalError("Sign-in attempt not complete. Please check your credentials or contact support.");
      }
    } catch (err: any) {
      setLocalError(
        err?.errors?.[0]?.longMessage || err?.message || "Invalid email or password."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SafeAreaView className="auth-safe-area" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Manager</Text>
                </View>
              </View>
            </View>

            <View className="mt-6 items-center">
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to your account to manage your subscriptions.
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email address</Text>
                  <TextInput
                    className={`auth-input ${localError ? "auth-input-error" : ""
                      }`}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={(text) => {
                      setEmailAddress(text);
                      setLocalError("");
                    }}
                    keyboardType="email-address"
                    editable={!isPending}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${localError ? "auth-input-error" : ""
                      }`}
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    secureTextEntry
                    onChangeText={(text) => {
                      setPassword(text);
                      setLocalError("");
                    }}
                    editable={!isPending}
                  />
                </View>

                {localError ? (
                  <Text className="auth-error text-center mt-1">
                    {localError}
                  </Text>
                ) : null}

                <Pressable
                  className={`auth-button ${!emailAddress || !password || isPending
                      ? "auth-button-disabled"
                      : ""
                    }`}
                  onPress={onSignInPress}
                  disabled={!emailAddress || !password || isPending}
                >
                  {isPending ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Sign In</Text>
                  )}
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row mt-8">
              <Text className="auth-link-copy">Don't have an account?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className="auth-link">Create Account</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
