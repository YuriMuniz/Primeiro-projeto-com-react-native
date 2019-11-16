import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import './config/ReactotronConfig';

const styles = StyleSheet.create({
    welcome: {
        fontSize: 20,
    },
});

console.tron.warn('Hello World');
export default function App() {
    return (
        <View>
            <Text style={styles.welcome}>Texto</Text>
        </View>
    );
}
