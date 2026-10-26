import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { COLORS } from './src/theme/styles';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DepartmentsScreen from './src/screens/DepartmentsScreen';
import ProgrammesScreen from './src/screens/ProgrammesScreen';
import BlocksScreen from './src/screens/BlocksScreen';
import RoomsScreen from './src/screens/RoomsScreen';
import UsersScreen from './src/screens/UsersScreen';
import ComplaintsScreen from './src/screens/ComplaintsScreen';
import ComplaintDetailScreen from './src/screens/ComplaintDetailScreen';
import RaiseComplaintScreen from './src/screens/RaiseComplaintScreen';
import DrawerContent from './src/components/DrawerContent';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const headerOpts = {
    headerStyle: { backgroundColor: COLORS.white },
    headerTintColor: COLORS.text,
    headerTitleStyle: { fontWeight: '800', color: COLORS.text },
    headerShadowVisible: true,
    contentStyle: { backgroundColor: COLORS.background },
};

const MenuButton = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuBtn}>
        <View style={styles.menuLine} />
        <View style={[styles.menuLine, { width: 20 }]} />
        <View style={[styles.menuLine, { width: 16 }]} />
    </TouchableOpacity>
);

const AppDrawer = () => {
    const { user } = useAuth();
    const isSuperadmin = user?.role?.name === 'Superadmin';

    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
                ...headerOpts,
                headerLeft: () => <MenuButton navigation={navigation} />,
                drawerStyle: { backgroundColor: COLORS.surface, width: 290 },
            })}
        >
            <Drawer.Screen name="Dashboard"  component={DashboardScreen}  options={{ title: 'Dashboard' }} />
            <Drawer.Screen name="Profile"    component={ProfileScreen}    options={{ title: 'My Profile' }} />
            <Drawer.Screen name="Complaints" component={ComplaintsScreen} options={{ title: 'Complaints' }} />
            {isSuperadmin && <>
                <Drawer.Screen name="Departments" component={DepartmentsScreen} options={{ title: 'Departments' }} />
                <Drawer.Screen name="Programmes"  component={ProgrammesScreen}  options={{ title: 'Programmes' }} />
                <Drawer.Screen name="Blocks"      component={BlocksScreen}      options={{ title: 'Blocks' }} />
                <Drawer.Screen name="Rooms"       component={RoomsScreen}       options={{ title: 'Room Numbers' }} />
                <Drawer.Screen name="Users"       component={UsersScreen}       options={{ title: 'Users' }} />
            </>}
        </Drawer.Navigator>
    );
};

const Navigation = () => {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.splash}>
                <Text style={styles.splashEmoji}>🎫</Text>
                <Text style={styles.splashText}>TMS</Text>
                <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!token ? (
                <>
                    <Stack.Screen name="Home"  component={HomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="App" component={AppDrawer} />
                    <Stack.Screen name="RaiseComplaint" component={RaiseComplaintScreen}
                        options={{ ...headerOpts, headerShown: true, title: 'Raise Complaint', presentation: 'modal' }} />
                    <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen}
                        options={{ ...headerOpts, headerShown: true, title: 'Complaint Details' }} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <NavigationContainer>
                    <StatusBar style="dark" />
                    <Navigation />
                </NavigationContainer>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    menuBtn: { padding: 10, gap: 5, justifyContent: 'center', marginLeft: 4 },
    menuLine: { height: 2, width: 24, backgroundColor: COLORS.text, borderRadius: 2 },
    splash: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
    splashEmoji: { fontSize: 64 },
    splashText: { fontSize: 32, fontWeight: '800', color: COLORS.text, letterSpacing: 6, marginTop: 12 },
});
