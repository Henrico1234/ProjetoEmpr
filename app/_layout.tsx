import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          
          <Drawer
            screenOptions={{
              headerTintColor: tintColor,
              drawerActiveTintColor: tintColor,
            }}
          >
            <Drawer.Screen
              name="(tabs)"
              options={{
                title: 'Principal',
                headerShown: false,
                drawerIcon: ({ color, size }) => (
                  <IconSymbol name="house.fill" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="relatorios"
              options={{
                title: 'Relatórios',
                drawerIcon: ({ color, size }) => (
                  <IconSymbol name="doc.text.fill" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="emprestimos"
              options={{
                title: 'Empréstimos',
                drawerIcon: ({ color, size }) => (
                  <IconSymbol name="banknote.fill" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="categorias"
              options={{
                title: 'Categorias',
                drawerIcon: ({ color, size }) => (
                  <IconSymbol name="list.bullet" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="modal"
              options={{
                title: 'Modal',
                drawerItemStyle: { display: 'none' },
              }}
            />
          </Drawer>
          
          <StatusBar style="auto" />
        </ThemeProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}