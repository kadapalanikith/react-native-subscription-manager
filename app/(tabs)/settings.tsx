import React from 'react';
import { StyleSheet, View , Text} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from "nativewind";
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-background">
            <Text>Settings</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Settings;
