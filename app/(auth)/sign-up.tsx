import { useSignUp, useAuth } from "@clerk/expo";
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

export default function SignUpScreen() {
  const { isLoaded } = useAuth();
  const { signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded || !signUp) return;
    setLocalError("");
    setIsPending(true);

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        setLocalError(
          error.longMessage || 
          error.message || 
          "An error occurred during sign up."
        );
        return;
      }

      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (err: any) {
      setLocalError(
        err?.errors?.[0]?.longMessage || err?.message || "Error creating account."
      );
    } finally {
      setIsPending(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded || !signUp) return;
    setLocalError("");
    setIsPending(true);

    try {
      await signUp.verifications.verifyEmailCode({
        code,
      });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: () => router.replace("/(tabs)"),
        });
      } else {
        setLocalError("Sign-up attempt not complete. Please check your details or contact support.");
      }
    } catch (err: any) {
      setLocalError(err?.errors?.[0]?.longMessage || err?.message || "Incorrect code.");
    } finally {
      setIsPending(false);
    }
  };

  const isVerifying = pendingVerification;

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
                        className={`auth-input ${localError ? "auth-input-error" : ""
                          }`}
                        value={code}
                        placeholder="Enter code"
                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          setCode(text);
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

                    {successMessage ? (
                      <Text className="text-green-600 text-center mt-1">
                        {successMessage}
                      </Text>
                    ) : null}

                    <Pressable
                      className={`auth-button ${!code || isPending ? "auth-button-disabled" : ""
                        }`}
                      onPress={onPressVerify}
                      disabled={!code || isPending}
                    >
                      {isPending ? (
                        <ActivityIndicator color="#081126" />
                      ) : (
                        <Text className="auth-button-text">Verify</Text>
                      )}
                    </Pressable>

                    <Pressable
                      className={`auth-secondary-button mt-4 ${isResending || isPending ? "opacity-50" : ""
                        }`}
                      disabled={isResending || isPending}
                      onPress={async () => {
                        try {
                          setIsResending(true);
                          setLocalError("");
                          setSuccessMessage("");
                          await signUp.verifications.sendEmailCode();
                          setSuccessMessage("Verification code resent");
                        } catch (err: any) {
                          setLocalError(err?.errors?.[0]?.longMessage || err?.message || "Failed to resend code.");
                        } finally {
                          setIsResending(false);
                        }
                      }}
                    >
                      {isResending ? (
                        <ActivityIndicator size="small" color="#081126" />
                      ) : (
                        <Text className="auth-secondary-button-text">
                          Resend Code
                        </Text>
                      )}
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
                        placeholder="Create a secure password"
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
                      onPress={onSignUpPress}
                      disabled={!emailAddress || !password || isPending}
                    >
                      {isPending ? (
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
