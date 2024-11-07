import { View, ActivityIndicator } from 'react-native';
const LoadingScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#171A21' }}>
            <ActivityIndicator size='large' />
        </View>
    );
};

export default LoadingScreen;
