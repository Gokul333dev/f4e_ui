import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavHeight } from '@/components/bottom-nav';

const C = {
  bg: '#FFFFFF',
  text: '#141A2E',
  muted: '#6B7280',
  placeholder: '#9AA1AE',
  line: '#E8EAF0',
  tint: '#E9EDF7',
  tintStrong: '#D8E0F3',
  card: '#F5F7FB',
  brand: '#151F52',
  brandDeep: '#0F1739',
  brandTag: '#1C2A5E',
  star: '#F0B429',
  red: '#FF3B30',
  white: '#FFFFFF',
};

const PHOTOS = {
  screen: require('@/assets/images/services/screen.jpg'),
  battery: require('@/assets/images/services/battery.jpg'),
  keyboard: require('@/assets/images/services/keyboard.jpg'),
  port: require('@/assets/images/services/port.jpg'),
  software: require('@/assets/images/services/software.jpg'),
  mascot: require('@/assets/images/services/mascot.png'),
  star: require('@/assets/images/services/star.png'),
  headerBackground: require('@/assets/images/header-background.png'),
} as const;

const SERVICES = [
  { id: 'screen', label: 'Screen Replacement', image: PHOTOS.screen },
  { id: 'battery', label: 'Battery Replacement', image: PHOTOS.battery },
  { id: 'keyboard', label: 'Keyboard Replacement', image: PHOTOS.keyboard },
  { id: 'port', label: 'Charging Port Repair', image: PHOTOS.port },
  { id: 'software', label: 'Software Installation', image: PHOTOS.software },
] as const;

function Icon({
  ios,
  android,
  size,
  color,
  weight = 'regular',
}: {
  ios: string;
  android: string;
  size: number;
  color: ColorValue;
  weight?: 'regular' | 'medium' | 'semibold';
}) {
  return (
    <SymbolView
      name={{ ios: ios as never, android: android as never, web: android as never }}
      size={size}
      tintColor={color}
      weight={weight}
    />
  );
}


function ServiceCard({ label, image }: { label: string; image: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]}>
      <Image
        source={image}
        style={styles.serviceImage}
        contentFit="contain"
        contentPosition="center"
        transition={150}
      />
      <Text style={styles.serviceLabel}>{label}</Text>
    </Pressable>
  );
}

function AllServicesCard() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="All services"
      style={({ pressed }) => [styles.serviceCard, styles.allServicesCard, pressed && styles.pressed]}>
      <View style={styles.allServicesArt}>
        <Icon ios="square.grid.2x2" android="apps" size={22} color={C.white} />
      </View>
      <Text style={[styles.serviceLabel, styles.allServicesLabel]}>All Services</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  // Keep the source image at its native 3:2 aspect ratio across screen sizes.
  const headerBackgroundHeight = windowWidth * (2 / 3);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 10,
            paddingBottom: Math.max(insets.bottom, 12) + BottomNavHeight + 28,
          },
        ]}>
        {/* Decorative header art: full-bleed behind the status, location and search rows.
            The supplied PNG fades to transparency at its lower edge, so the promo card
            and the rest of the screen remain visually unchanged. */}
        <Image
          source={PHOTOS.headerBackground}
          style={[
            styles.headerBackground,
            { top: 0, height: headerBackgroundHeight },
          ]}
          contentFit="fill"
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no"
        />

        <View style={styles.topRow}>
          <Pressable style={({ pressed }) => [styles.location, pressed && styles.pressed]} accessibilityRole="button">
            <Icon ios="mappin.and.ellipse" android="location_on" size={18} color={C.text} />
            <Text style={styles.locationText}>Chicago, IL, USA</Text>
            <Icon ios="chevron.down" android="expand_more" size={14} color={C.text} weight="semibold" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Notifications">
            <Icon ios="bell" android="notifications" size={20} color={C.text} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <Pressable
            style={({ pressed }) => [styles.search, pressed && styles.pressed]}
            accessibilityRole="button">
            <Icon ios="magnifyingglass" android="search" size={18} color={C.placeholder} />
            <Text style={styles.searchPlaceholder}>Search for repairs...</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Filters">
            <Icon ios="slider.horizontal.3" android="tune" size={18} color={C.text} />
          </Pressable>
        </View>

        <View style={styles.promo}>
          <View style={styles.promoVisualSpace} pointerEvents="none" />
          <Image
            source={PHOTOS.mascot}
            style={styles.promoMascot}
            contentFit="contain"
            contentPosition="center"
            transition={180}
            accessibilityLabel="Fix4Ever repair mascot with laptop"
          />

          <View style={styles.promoCopy}>
            <View style={styles.promoBadge}>
              <Icon ios="sparkles" android="auto_awesome" size={13} color="#244BCB" />
              <Text style={styles.promoBadgeText}>NEW USER OFFER</Text>
            </View>

            <View style={styles.promoHeadline}>
              <Text style={styles.promoTitle}>Get</Text>
              <View style={styles.promoDiscount}>
                <Text style={styles.promoDiscountText}>25%</Text>
              </View>
              <Text style={styles.promoTitle}>OFF</Text>
            </View>

            <Text style={styles.promoSubtitle}>On your first laptop repair</Text>

            <Pressable
              style={({ pressed }) => [styles.claim, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Claim your 25 percent discount">
              <Text style={styles.claimText}>Claim now</Text>
              <Icon ios="arrow.right" android="arrow_forward" size={16} color={C.white} weight="semibold" />
            </Pressable>
          </View>

          <View style={styles.dots} pointerEvents="none">
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.bookingCta, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Book a repair">
          <View style={styles.bookingCtaIcon}>
            <Icon ios="wrench.and.screwdriver.fill" android="build" size={18} color={C.white} />
          </View>
          <View style={styles.bookingCtaCopy}>
            <Text style={styles.bookingCtaTitle}>Need a repair?</Text>
            <Text style={styles.bookingCtaSubtitle}>Book a doorstep pickup in minutes</Text>
          </View>
          <View style={styles.bookingCtaArrow}>
            <Icon ios="arrow.right" android="arrow_forward" size={17} color={C.brand} weight="semibold" />
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Repairs</Text>
          <Pressable accessibilityRole="button" hitSlop={8}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.serviceRow}>
          {SERVICES.slice(0, 3).map((service) => (
            <ServiceCard key={service.id} label={service.label} image={service.image} />
          ))}
        </View>
        <View style={styles.serviceRow}>
          {SERVICES.slice(3).map((service) => (
            <ServiceCard key={service.id} label={service.label} image={service.image} />
          ))}
          <AllServicesCard />
        </View>

        <View style={styles.plusCard}>
          <View style={styles.plusHero}>
            <View style={styles.plusHeroCopy}>
              <View style={styles.plusEyebrowPill}>
                <Icon ios="crown.fill" android="workspace_premium" size={13} color={C.brand} />
                <Text style={styles.plusEyebrow}>MEMBERSHIP</Text>
              </View>
              <Text style={styles.plusTitle}>Fix4Ever <Text style={styles.plusTitleAccent}>Plus</Text></Text>
              <Text style={styles.plusDescription}>
                A little more value with every repair.
              </Text>
            </View>
            <Image
              source={PHOTOS.star}
              style={styles.plusStarGraphic}
              contentFit="contain"
              contentPosition="center"
              transition={180}
              accessibilityLabel="Glossy blue and purple Fix4Ever Plus star emblem"
            />
          </View>

          <View style={styles.plusBenefits}>
            <Text style={styles.plusBenefitsHeading}>What’s included</Text>

            <View style={styles.plusBenefitRow}>
              <View style={styles.plusBenefitIcon}>
                <Icon ios="tag.fill" android="sell" size={17} color={C.brand} />
              </View>
              <Text style={styles.plusBenefitText}>Exclusive member offers</Text>
            </View>

            <View style={styles.plusBenefitRow}>
              <View style={styles.plusBenefitIcon}>
                <Icon ios="sparkles" android="auto_awesome" size={17} color={C.brand} />
              </View>
              <Text style={styles.plusBenefitText}>Special perks for members</Text>
            </View>

            <View style={styles.plusBenefitRow}>
              <View style={styles.plusBenefitIcon}>
                <Icon ios="laptopcomputer" android="laptop" size={17} color={C.brand} />
              </View>
              <Text style={styles.plusBenefitText}>More value on laptop repairs</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.plusBenefitsButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="View Fix4Ever Plus benefits">
            <Text style={styles.plusBenefitsText}>View benefits</Text>
            <Icon ios="arrow.right" android="arrow_forward" size={16} color={C.white} weight="semibold" />
          </Pressable>
        </View>

        <View style={styles.customerProof}>
          <Icon ios="checkmark.seal.fill" android="verified" size={14} color={C.brand} />
          <Text style={styles.customerProofText}>Loved by 3,000+ customers</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  headerBackground: {
    position: 'absolute',
    left: -20,
    right: -20,
    // It sits behind the first two rows and fades out over the transition to the promo.
    zIndex: 0,
  },
  pressed: {
    opacity: 0.75,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  locationText: {
    color: C.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 12,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: C.white,
  },
  searchRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  search: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    color: C.placeholder,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  },
  promo: {
    marginTop: 20,
    minHeight: 178,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 30,
    borderRadius: 24,
    backgroundColor: '#F7F8FB',
    borderWidth: 1,
    borderColor: '#ECEEF3',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  promoVisualSpace: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '40%',
    backgroundColor: '#F0F2F7',
    borderTopLeftRadius: 110,
    borderBottomLeftRadius: 110,
  },
  promoMascot: {
    position: 'absolute',
    right: 2,
    bottom: 16,
    width: '43%',
    height: 148,
    zIndex: 0,
  },
  promoCopy: {
    width: '66%',
    zIndex: 1,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    height: 26,
    paddingHorizontal: 9,
    borderRadius: 13,
    backgroundColor: '#ECEFF5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promoBadgeText: {
    color: C.brand,
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  promoHeadline: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  promoTitle: {
    color: C.text,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  promoDiscount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: C.brand,
  },
  promoDiscountText: {
    color: C.white,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  promoSubtitle: {
    marginTop: 5,
    color: '#747B8B',
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '500',
  },
  claim: {
    marginTop: 12,
    alignSelf: 'flex-start',
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: C.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  claimText: {
    color: C.white,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4D8E1',
  },
  dotActive: {
    width: 18,
    backgroundColor: C.brand,
  },
  bookingCta: {
    marginTop: 16,
    minHeight: 70,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 18,
    backgroundColor: C.brand,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  bookingCtaIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingCtaCopy: { flex: 1 },
  bookingCtaTitle: {
    color: C.white,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bookingCtaSubtitle: {
    marginTop: 2,
    color: '#D8DEEF',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
  bookingCtaArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: C.text,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  viewAll: {
    color: C.brand,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  serviceRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 7,
    paddingBottom: 10,
  },
  serviceImage: {
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: 12,
    backgroundColor: C.white,
  },
  serviceLabel: {
    marginTop: 8,
    minHeight: 32,
    paddingHorizontal: 2,
    textAlign: 'center',
    color: C.text,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  allServicesCard: {
    backgroundColor: C.brand,
    alignItems: 'center',
  },
  allServicesArt: {
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allServicesLabel: {
    color: C.white,
  },
  plusCard: {
    marginTop: 24,
    marginBottom: 2,
    padding: 12,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEEF4',
    shadowColor: '#151F52',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.055,
    shadowRadius: 14,
    elevation: 2,
  },
  plusHero: {
    minHeight: 154,
    padding: 16,
    borderRadius: 17,
    backgroundColor: '#F4F5FA',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  plusHeroCopy: {
    width: '72%',
    zIndex: 1,
  },
  plusEyebrowPill: {
    alignSelf: 'flex-start',
    height: 27,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plusEyebrow: {
    color: C.brand,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 0.75,
  },
  plusTitle: {
    marginTop: 14,
    color: '#141A2E',
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.9,
  },
  plusTitleAccent: {
    color: '#344CB0',
    fontStyle: 'italic',
  },
  plusDescription: {
    marginTop: 6,
    color: '#737A8A',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  plusGraphicSpace: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '34%',
    backgroundColor: '#E9ECF8',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    opacity: 0.9,
  },
  plusStarGraphic: {
    position: 'absolute',
    right: -8,
    top: 4,
    width: 142,
    height: 142,
    zIndex: 0,
  },
  plusBenefits: {
    paddingHorizontal: 10,
    paddingTop: 17,
    paddingBottom: 8,
  },
  plusBenefitsHeading: {
    marginBottom: 9,
    color: '#858B98',
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '600',
  },
  plusBenefitRow: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  plusBenefitIcon: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: '#F0F2F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBenefitText: {
    flex: 1,
    color: C.text,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  plusBenefitsButton: {
    marginTop: 8,
    marginHorizontal: 5,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: C.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  plusBenefitsText: {
    color: C.white,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  customerProof: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  customerProofText: {
    color: C.muted,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
  },
});
