import { useSignIn } from "@clerk/expo";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLocalError("");

    try {
      const { error, status } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        setLocalError(error.longMessage || "An error occurred during sign in.");
        return;
      }

      if (status === "complete") {
        await signIn.finalize({
          // If no session tasks, navigate the signed-in user to the home page
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.replace("/(tabs)");
          },
        });
      } else {
        console.error("Sign-in attempt not complete:", signIn);
      }
    } catch (err: any) {
      console.error(err);
      setLocalError(
        err?.errors?.[0]?.longMessage || "Invalid email or password."
      );
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
                    className={`auth-input ${
                      localError || errors?.fields?.identifier ? "auth-input-error" : ""
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
                    editable={fetchStatus !== "fetching"}
                  />
                  {errors?.fields?.identifier && (
                    <Text className="auth-error">
                      {errors.fields.identifier.message}
                    </Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${
                      localError || errors?.fields?.password ? "auth-input-error" : ""
                    }`}
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    secureTextEntry
                    onChangeText={(text) => {
                      setPassword(text);
                      setLocalError("");
                    }}
                    editable={fetchStatus !== "fetching"}
                  />
                  {errors?.fields?.password && (
                    <Text className="auth-error">
                      {errors.fields.password.message}
                    </Text>
                  )}
                </View>

                {localError ? (
                  <Text className="auth-error text-center mt-1">
                    {localError}
                  </Text>
                ) : null}

                <Pressable
                  className={`auth-button ${
                    !emailAddress || !password || fetchStatus === "fetching"
                      ? "auth-button-disabled"
                      : ""
                  }`}
                  onPress={onSignInPress}
                  disabled={!emailAddress || !password || fetchStatus === "fetching"}
                >
                  {fetchStatus === "fetching" ? (
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
