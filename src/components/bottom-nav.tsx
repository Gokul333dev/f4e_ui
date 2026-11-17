import { GlassView } from 'expo-glass-effect';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

/* -------------------------------------------------------------------------------------------- *
 * Tokens — the single place to tune the bar.
 * -------------------------------------------------------------------------------------------- */

/** Height of the floating capsule. Screens use `BottomNavHeight` for their bottom padding. */
const BAR_HEIGHT = 64;
/** Fully rounded capsule. */
const BAR_RADIUS = BAR_HEIGHT / 2;
/** Horizontal inset from the screen edges. */
const HORIZONTAL_INSET = 16;
/** Gap between the bar and the bottom safe-area inset. */
const BOTTOM_LIFT = 12;
/** Breathing room for the active capsule inside the bar. */
const BAR_PADDING = 4;
/** Radius of the active-tab capsule. */
const CAPSULE_RADIUS = BAR_RADIUS - BAR_PADDING;

const ICON_SIZE = 24;
const LABEL_SIZE = 10.5;
const LABEL_LINE_HEIGHT = 13;
const LABEL_GAP = 2;

/** Backdrop blur radius (CSS `backdrop-filter`, web only — iOS uses the native material). */
const BLUR_RADIUS = 24;
/** Hairline border. */
const HAIRLINE_WIDTH = 0.5;

/** Apple-style spring for the sliding capsule (~280ms settle). */
const CAPSULE_SPRING = { stiffness: 300, damping: 25, mass: 1 };
/** Snappier spring for the press-in / press-out scale. */
const PRESS_SPRING = { stiffness: 400, damping: 32, mass: 0.6 };
/** Reduced-motion fallback: a short fade instead of a spring. */
const REDUCED_MOTION = { duration: 160 };

export const BottomNavHeight = BAR_HEIGHT;

/* -------------------------------------------------------------------------------------------- *
 * Colors — light and dark are defined together so nothing is hardcoded per mode.
 * -------------------------------------------------------------------------------------------- */

type NavPalette = {
  /** Active icon + label. */
  accent: string;
  /** Inactive icon + label (AA contrast on the bar surface). */
  inactive: string;
  /** Translucent capsule behind the focused tab. */
  capsule: string;
  /** Glass fill: white ~70% / near-black ~68%. */
  surface: string;
  /** Opaque-ish fallback where no blur is available. */
  surfaceOpaque: string;
  /** 0.5px hairline. */
  hairline: string;
  /** Shadow tint. */
  shadow: string;
};

const NAV_PALETTE: { light: NavPalette; dark: NavPalette } = {
  light: {
    accent: '#151F52',
    inactive: '#5C6370',
    capsule: 'rgba(17, 24, 51, 0.08)',
    surface: 'rgba(255, 255, 255, 0.75)',
    surfaceOpaque: 'rgba(255, 255, 255, 0.94)',
    hairline: 'rgba(0, 0, 0, 0.08)',
    shadow: '#0B1230',
  },
  dark: {
    accent: '#B7C2F5',
    inactive: '#B4BAC6',
    capsule: 'rgba(255, 255, 255, 0.16)',
    surface: 'rgba(16, 17, 22, 0.82)',
    surfaceOpaque: 'rgba(22, 23, 28, 0.94)',
    hairline: 'rgba(255, 255, 255, 0.12)',
    shadow: '#000000',
  },
};

/** Filled SF Symbol used for the active tab (falls back to the outline name). */
const FILLED_ICON: Record<string, string> = {
  house: 'house.fill',
  'list.bullet.rectangle': 'list.bullet.rectangle.fill',
  gift: 'gift.fill',
  person: 'person.fill',
  plus: 'plus',
};

/* -------------------------------------------------------------------------------------------- *
 * Motion helpers
 * -------------------------------------------------------------------------------------------- */

/**
 * Light haptic on tab change.
 *
 * `expo-haptics` is not a dependency of this project yet, so this is intentionally a no-op.
 * To enable: `npx expo install expo-haptics`, add `import * as Haptics from 'expo-haptics';`
 * at the top of this file, and replace the body with `Haptics.selectionAsync();`.
 */
function selectionHaptic() {}

/* -------------------------------------------------------------------------------------------- *
 * Sliding capsule plumbing
 * -------------------------------------------------------------------------------------------- */

type TabLayout = { x: number; width: number };

type NavController = {
  palette: NavPalette;
  reportLayout: (key: string, layout: TabLayout) => void;
  reportActive: (key: string) => void;
};

const NavContext = createContext<NavController | null>(null);

/* -------------------------------------------------------------------------------------------- *
 * Tab
 * -------------------------------------------------------------------------------------------- */

type NavItemProps = TabTriggerSlotProps & {
  ios: string;
  android: string;
  label: string;
};

export function NavItem({
  ios,
  android,
  label,
  isFocused,
  href: _href,
  style: _style,
  ref: _ref,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: NavItemProps) {
  const controller = useContext(NavContext);
  const palette = controller?.palette ?? NAV_PALETTE.light;
  const reduceMotion = useReducedMotion();

  const pressScale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: pressScale.value }] }));

  useEffect(() => {
    if (isFocused) controller?.reportActive(label);
  }, [controller, isFocused, label]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      controller?.reportLayout(label, { x, width });
    },
    [controller, label]
  );

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      pressScale.value = reduceMotion
        ? withTiming(0.96, { duration: 90 })
        : withSpring(0.96, PRESS_SPRING);
      onPressIn?.(event);
    },
    [onPressIn, pressScale, reduceMotion]
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      pressScale.value = reduceMotion
        ? withTiming(1, REDUCED_MOTION)
        : withSpring(1, PRESS_SPRING);
      onPressOut?.(event);
    },
    [onPressOut, pressScale, reduceMotion]
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      selectionHaptic();
      onPress?.(event);
    },
    [onPress]
  );

  const icon = isFocused ? (FILLED_ICON[ios] ?? ios) : ios;
  const color = isFocused ? palette.accent : palette.inactive;

  return (
    <Pressable
      {...rest}
      onLayout={handleLayout}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      aria-selected={isFocused}
      style={styles.item}>
      <Animated.View style={[styles.itemContent, pressStyle]}>
        <SymbolView
          name={{ ios: icon as never, android: android as never, web: android as never }}
          size={ICON_SIZE}
          tintColor={color}
          weight={isFocused ? 'medium' : 'regular'}
          style={styles.icon}
        />
        <Text numberOfLines={1} style={[styles.label, { color }]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------------------------- *
 * Bar
 * -------------------------------------------------------------------------------------------- */

type BottomNavProps = ViewProps & {
  children: ReactNode;
};

export function BottomNav({ children, style, ...props }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const reduceMotion = useReducedMotion();
  const palette = scheme === 'dark' ? NAV_PALETTE.dark : NAV_PALETTE.light;

  const capsuleX = useSharedValue(0);
  const capsuleWidth = useSharedValue(0);
  const positioned = useRef(false);
  const layouts = useRef<Record<string, TabLayout>>({});
  const activeKey = useRef<string | null>(null);

  const syncCapsule = useCallback(() => {
    const key = activeKey.current;
    if (!key) return;
    const layout = layouts.current[key];
    if (!layout) return;

    // First measurement: place the capsule without animating from the left edge.
    if (!positioned.current) {
      positioned.current = true;
      capsuleX.value = layout.x;
      capsuleWidth.value = layout.width;
      return;
    }

    if (reduceMotion) {
      capsuleX.value = withTiming(layout.x, REDUCED_MOTION);
      capsuleWidth.value = withTiming(layout.width, REDUCED_MOTION);
    } else {
      capsuleX.value = withSpring(layout.x, CAPSULE_SPRING);
      capsuleWidth.value = withSpring(layout.width, CAPSULE_SPRING);
    }
  }, [capsuleWidth, capsuleX, reduceMotion]);

  const controller = useMemo<NavController>(
    () => ({
      palette,
      reportLayout(key, layout) {
        console.log('[navdbg] layout', key, JSON.stringify(layout));
        layouts.current[key] = layout;
        syncCapsule();
      },
      reportActive(key) {
        console.log('[navdbg] active', key);
        activeKey.current = key;
        syncCapsule();
      },
    }),
    [palette, syncCapsule]
  );

  const capsuleStyle = useAnimatedStyle(() => ({
    opacity: capsuleWidth.value > 0 ? 1 : 0,
    width: capsuleWidth.value,
    transform: [{ translateX: capsuleX.value }],
  }));

  // Android has no blur, so it gets the near-opaque surface instead of the translucent one.
  const surface = Platform.OS === 'android' ? palette.surfaceOpaque : palette.surface;

  return (
    <View
      {...props}
      pointerEvents="box-none"
      style={StyleSheet.flatten([
        style,
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 8) + BOTTOM_LIFT },
      ])}>
      <View
        style={[
          styles.bar,
          iosSquircle,
          { backgroundColor: surface, shadowColor: palette.shadow },
          Platform.OS === 'web' ? webBackdrop : null,
          Platform.OS === 'web' ? webShadow(palette.shadow) : null,
        ]}>
        {Platform.OS === 'ios' ? (
          <GlassView glassEffectStyle="regular" style={styles.glass} />
        ) : null}

        <NavContext.Provider value={controller}>
          <View style={styles.track} accessibilityRole="tablist">
            <Animated.View
              pointerEvents="none"
              style={[styles.capsule, { backgroundColor: palette.capsule }, capsuleStyle]}
            />
            {children}
          </View>
        </NavContext.Provider>

        <View
          pointerEvents="none"
          style={[styles.hairline, iosSquircle, { borderColor: palette.hairline }]}
        />
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------------------------- *
 * Platform styles
 * -------------------------------------------------------------------------------------------- */

const webBackdrop =
  Platform.OS === 'web'
    ? ({
        backdropFilter: `blur(${BLUR_RADIUS}px)`,
        WebkitBackdropFilter: `blur(${BLUR_RADIUS}px)`,
      } as unknown as ViewStyle)
    : null;

const iosSquircle: ViewStyle | null = Platform.OS === 'ios' ? { borderCurve: 'continuous' } : null;

/**
 * React Native Web ignores the `shadow*` props, so the same soft shadow is emitted as a
 * CSS `box-shadow` (8% alpha, y8 / blur 24).
 */
const webShadow = (shadow: string): ViewStyle =>
  ({ boxShadow: `0px 8px 24px ${shadow}14` } as unknown as ViewStyle);

const ABSOLUTE_FILL: ViewStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: HORIZONTAL_INSET,
  },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
    shadowOpacity: 0.08,
    shadowRadius: BLUR_RADIUS,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  glass: {
    ...ABSOLUTE_FILL,
    borderRadius: BAR_RADIUS,
  },
  track: {
    ...ABSOLUTE_FILL,
    top: BAR_PADDING,
    left: BAR_PADDING,
    right: BAR_PADDING,
    bottom: BAR_PADDING,
    flexDirection: 'row',
  },
  capsule: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: CAPSULE_RADIUS,
  },
  hairline: {
    ...ABSOLUTE_FILL,
    borderRadius: BAR_RADIUS,
    borderWidth: HAIRLINE_WIDTH,
  },
  item: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: LABEL_GAP,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  label: {
    fontSize: LABEL_SIZE,
    lineHeight: LABEL_LINE_HEIGHT,
    fontWeight: '500',
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
