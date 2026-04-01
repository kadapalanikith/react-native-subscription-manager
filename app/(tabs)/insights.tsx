import React from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from "nativewind";
const SafeAreaView = styled(RNSafeAreaView);

const Insights = () => {
    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-background">
            <Text>Insights</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Insights;
