import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavHeight } from '@/components/bottom-nav';

type ScreenPlaceholderProps = {
  title: string;
  description: string;
  ios: string;
  android: string;
};

export function ScreenPlaceholder({ title, description, ios, android }: ScreenPlaceholderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 14,
          paddingBottom: Math.max(insets.bottom, 12) + BottomNavHeight + 28,
        },
      ]}>
      <StatusBar style="dark" />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.center}>
        <View style={styles.badge}>
          <SymbolView
            name={{ ios: ios as never, android: android as never, web: android as never }}
            size={30}
            tintColor="#151F52"
          />
        </View>
        <Text style={styles.body}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    color: '#141A2E',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 40,
  },
  badge: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: '#E9EDF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    maxWidth: 280,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
