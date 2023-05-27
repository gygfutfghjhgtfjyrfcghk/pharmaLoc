import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const Splash = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('AppPage');
        }, 3000);
    }, [navigation]);

    return (
        <View style={styles.container}>
           
            <Text style={styles.title}>PharmaLocation</Text>
            {isLoading && (
                <ActivityIndicator
                    size="large"
                    
                    color="#020288"
                    style={{ marginTop: 80    }}
                />
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    icon: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 25,
        marginTop: 16,
        color: '#0000FF',
        fontWeight: 'bold'
    },
});

export default Splash;
