import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from "nativewind";
import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/(auth)/sign-in');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background px-5 pt-8">
            <View className="mb-8">
                <Text className="text-3xl font-sans-bold text-primary">Settings</Text>
                <Text className="mt-2 text-base font-sans-medium text-muted-foreground">Manage your account and preferences</Text>
            </View>

            <View className="auth-card">
                <View className="gap-6">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-lg font-sans-semibold text-primary">Account</Text>
                            <Text className="text-sm font-sans-medium text-muted-foreground">Sign out of your account</Text>
                        </View>
                    </View>
                    
                    <Pressable 
                        className="auth-button bg-destructive/10 border border-destructive/20"
                        onPress={handleSignOut}
                    >
                        <Text className="text-base font-sans-bold text-destructive">Logout</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Settings;
