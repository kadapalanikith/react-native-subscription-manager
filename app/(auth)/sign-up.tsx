import { useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
  const { isLoaded, signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLocalError("");

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        setLocalError(error.longMessage || "An error occurred.");
        return;
      }

      await signUp.verifications.sendEmailCode();
    } catch (err: any) {
      console.error(err);
      setLocalError(
        err?.errors?.[0]?.longMessage || "Error creating account."
      );
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLocalError("");

    try {
      await signUp.verifications.verifyEmailCode({
        code,
      });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.replace("/(tabs)");
          },
        });
      } else {
        console.error("Sign-up attempt not complete:", signUp);
      }
    } catch (err: any) {
      console.error(err);
      setLocalError(err?.errors?.[0]?.longMessage || "Incorrect code.");
    }
  };

  const isVerifying =
    signUp?.status === "missing_requirements" &&
    signUp?.unverifiedFields.includes("email_address") &&
    signUp?.missingFields.length === 0;

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

            {isVerifying ? (
              <View className="mt-6 items-center">
                <Text className="auth-title">Verify your account</Text>
                <Text className="auth-subtitle">
                  We've sent a verification code to {emailAddress}. Enter the code below.
                </Text>

                <View className="auth-card w-full mt-8">
                  <View className="auth-form">
                    <View className="auth-field">
                      <Text className="auth-label">Verification Code</Text>
                      <TextInput
                        className={`auth-input ${
                          localError || errors?.fields?.code ? "auth-input-error" : ""
                        }`}
                        value={code}
                        placeholder="Enter code"
                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          setCode(text);
                          setLocalError("");
                        }}
                        editable={fetchStatus !== "fetching"}
                      />
                      {errors?.fields?.code && (
                        <Text className="auth-error">
                          {errors.fields.code.message}
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
                        !code || fetchStatus === "fetching" ? "auth-button-disabled" : ""
                      }`}
                      onPress={onPressVerify}
                      disabled={!code || fetchStatus === "fetching"}
                    >
                      {fetchStatus === "fetching" ? (
                        <ActivityIndicator color="#081126" />
                      ) : (
                        <Text className="auth-button-text">Verify</Text>
                      )}
                    </Pressable>

                    <Pressable
                      className="auth-secondary-button mt-2"
                      onPress={() => signUp?.verifications.sendEmailCode()}
                    >
                      <Text className="auth-secondary-button-text">
                        Resend Code
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : (
              <View className="mt-6 items-center">
                <Text className="auth-title">Create an account</Text>
                <Text className="auth-subtitle">
                  Join us today and start managing your subscriptions.
                </Text>

                <View className="auth-card w-full mt-8">
                  <View className="auth-form">
                    <View className="auth-field">
                      <Text className="auth-label">Email address</Text>
                      <TextInput
                        className={`auth-input ${
                          localError || errors?.fields?.emailAddress ? "auth-input-error" : ""
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
                      {errors?.fields?.emailAddress && (
                        <Text className="auth-error">
                          {errors.fields.emailAddress.message}
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
                        placeholder="Create a secure password"
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
                      onPress={onSignUpPress}
                      disabled={!emailAddress || !password || fetchStatus === "fetching"}
                    >
                      {fetchStatus === "fetching" ? (
                        <ActivityIndicator color="#081126" />
                      ) : (
                        <Text className="auth-button-text">Sign Up</Text>
                      )}
                    </Pressable>
                  </View>
                </View>

                <View className="auth-link-row mt-8">
                  <Text className="auth-link-copy">Already have an account?</Text>
                  <Link href="/(auth)/sign-in" asChild>
                    <Pressable>
                      <Text className="auth-link">Sign In</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
