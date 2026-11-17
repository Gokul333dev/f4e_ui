import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { type ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = {
  bg: '#FFFFFF',
  text: '#1C1C1E',
  muted: '#8E939C',
  placeholder: '#A3A8B0',
  line: '#E8E8EC',
  tint: '#EAEDF7',
  card: '#F2F4F9',
  brand: '#151F52',
  brandDeep: '#0F1739',
  brandTag: '#1C2A5E',
  red: '#FF3B30',
  white: '#FFFFFF',
};

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

function PoolArt() {
  return (
    <View style={art.stage}>
      <View style={art.ladder}>
        <View style={art.ladderRail} />
        <View style={[art.ladderRail, art.ladderRailRight]} />
        <View style={[art.rung, { top: 6 }]} />
        <View style={[art.rung, { top: 14 }]} />
        <View style={[art.rung, { top: 22 }]} />
      </View>
      <View style={art.pool}>
        <View style={art.poolRim} />
        <View style={art.water} />
      </View>
      <View style={art.net}>
        <View style={art.netHead} />
        <View style={art.netPole} />
      </View>
    </View>
  );
}

function PaintArt() {
  return (
    <View style={art.stage}>
      <View style={art.roller}>
        <View style={art.rollerHead} />
        <View style={art.rollerNeck} />
        <View style={art.rollerHandle} />
      </View>
      <View style={art.bucket}>
        <View style={art.bucketBody} />
        <View style={art.bucketPaint} />
        <View style={art.bucketRim} />
        <View style={art.drip} />
      </View>
    </View>
  );
}

function HomeArt() {
  return (
    <View style={art.stage}>
      <View style={art.roof} />
      <View style={art.house}>
        <View style={art.beamRow}>
          <View style={art.beam} />
          <View style={art.beam} />
          <View style={art.beam} />
        </View>
        <View style={art.windowRow}>
          <View style={art.window} />
          <View style={art.window} />
        </View>
      </View>
      <View style={art.chimney} />
    </View>
  );
}

function ElectricArt() {
  return (
    <View style={art.stage}>
      <View style={art.cable} />
      <View style={art.outlet}>
        <View style={art.socket}>
          <View style={art.pinRow}>
            <View style={art.pin} />
            <View style={art.pin} />
          </View>
          <View style={art.ground} />
        </View>
        <View style={art.socket}>
          <View style={art.pinRow}>
            <View style={art.pin} />
            <View style={art.pin} />
          </View>
          <View style={art.ground} />
        </View>
      </View>
    </View>
  );
}

function TileArt() {
  return (
    <View style={art.stage}>
      <View style={art.tileGrid}>
        <View style={art.tile} />
        <View style={[art.tile, art.tileAlt]} />
        <View style={[art.tile, art.tileAlt]} />
        <View style={art.tile} />
      </View>
    </View>
  );
}

function PipeArt() {
  return (
    <View style={art.stage}>
      <View style={art.trap} />
      <View style={art.trapInner} />
      <View style={art.wrench}>
        <View style={art.wrenchHead} />
        <View style={art.wrenchBar} />
      </View>
    </View>
  );
}

function PriceTag() {
  return (
    <View style={styles.tagAnchor} pointerEvents="none">
      <View style={styles.tagLoop} />
      <View style={styles.tagShadow}>
        <View style={styles.tagFace}>
          <View style={styles.tagHole} />
          <Text style={styles.tagPercent}>%</Text>
        </View>
      </View>
    </View>
  );
}

function CleanerScene() {
  return (
    <View style={styles.cleanerCard}>
      <View style={styles.cleanerWall} />
      <View style={styles.cloth} />
      <View style={styles.clothShade} />
      <View style={styles.gloveLeft}>
        <View style={styles.gloveLeftThumb} />
      </View>
      <View style={styles.bottle}>
        <View style={styles.bottleLiquid} />
        <View style={styles.bottleNeck} />
        <View style={styles.trigger} />
        <View style={styles.nozzle} />
      </View>
      <View style={styles.forearm} />
      <View style={styles.gloveRight}>
        <View style={styles.gloveRightThumb} />
      </View>
    </View>
  );
}

const SERVICES = [
  { id: 'pool', label: 'Swimming\nPool Cleaning', Art: PoolArt },
  { id: 'paint', label: 'Home\nPainting', Art: PaintArt },
  { id: 'home', label: 'New Home\nConstruction', Art: HomeArt },
  { id: 'electric', label: 'Electrical\nWiring', Art: ElectricArt },
  { id: 'tile', label: 'Tile\nInstallation', Art: TileArt },
  { id: 'plumb', label: 'Plumbing\nServices', Art: PipeArt },
] as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

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
            paddingBottom: Math.max(insets.bottom, 16) + 28,
          },
        ]}>
        <View style={styles.topRow}>
          <Pressable style={styles.location} accessibilityRole="button">
            <Icon ios="mappin.and.ellipse" android="location_on" size={18} color={C.text} />
            <Text style={styles.locationText}>Chicago, IL, USA</Text>
            <Icon ios="chevron.down" android="expand_more" size={14} color={C.text} weight="semibold" />
          </Pressable>
          <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Notifications">
            <Icon ios="bell" android="notifications" size={20} color={C.text} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <Pressable style={styles.search} accessibilityRole="button">
            <Icon ios="magnifyingglass" android="search" size={18} color={C.placeholder} />
            <Text style={styles.searchPlaceholder}>Search for services...</Text>
          </Pressable>
          <Pressable
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Filters">
            <Icon ios="slider.horizontal.3" android="tune" size={18} color={C.text} />
          </Pressable>
        </View>

        <View style={styles.promo}>
          <View style={styles.promoCopy}>
            <Text style={styles.promoTitle}>Get 25% OFF</Text>
            <Text style={styles.promoSubtitle}>Enjoy your first booking</Text>
            <Pressable style={styles.claim} accessibilityRole="button">
              <Text style={styles.claimText}>Claim now</Text>
            </Pressable>
          </View>
          <PriceTag />
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <Pressable accessibilityRole="button" hitSlop={8}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.serviceRow}>
          {SERVICES.slice(0, 3).map((service) => (
            <ServiceCard key={service.id} label={service.label} Art={service.Art} />
          ))}
        </View>
        <View style={styles.serviceRow}>
          {SERVICES.slice(3).map((service) => (
            <ServiceCard key={service.id} label={service.label} Art={service.Art} />
          ))}
        </View>

        <Text style={styles.cleanersTitle}>Our best cleaners</Text>
        <CleanerScene />
      </ScrollView>
    </View>
  );
}

function ServiceCard({
  label,
  Art,
}: {
  label: string;
  Art: ComponentType;
}) {
  return (
    <Pressable style={styles.serviceCard} accessibilityRole="button">
      <View style={styles.serviceArt}>
        <Art />
      </View>
      <Text style={styles.serviceLabel}>{label}</Text>
    </Pressable>
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
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.red,
  },
  searchRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  search: {
    flex: 1,
    height: 48,
    borderRadius: 24,
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
    marginTop: 18,
    backgroundColor: C.tint,
    borderRadius: 22,
    minHeight: 164,
    paddingTop: 18,
    paddingLeft: 18,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  promoCopy: {
    maxWidth: '62%',
    zIndex: 1,
  },
  promoTitle: {
    color: C.text,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  promoSubtitle: {
    marginTop: 4,
    color: '#8B9098',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  claim: {
    marginTop: 16,
    alignSelf: 'flex-start',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: C.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimText: {
    color: C.white,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D8D8D8',
  },
  dotActive: {
    backgroundColor: C.brand,
  },
  tagAnchor: {
    position: 'absolute',
    right: -6,
    top: 18,
    width: 130,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagLoop: {
    position: 'absolute',
    top: 8,
    left: 22,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: C.brandTag,
    transform: [{ rotate: '-18deg' }],
  },
  tagShadow: {
    width: 96,
    height: 76,
    borderRadius: 16,
    backgroundColor: C.brandDeep,
    transform: [{ rotate: '-16deg' }],
    shadowColor: '#0A1030',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  tagFace: {
    flex: 1,
    marginBottom: 5,
    borderRadius: 16,
    backgroundColor: C.brandTag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagHole: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.tint,
    borderWidth: 2,
    borderColor: '#3B4A8F',
  },
  tagPercent: {
    color: C.white,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -1,
    marginLeft: 6,
  },
  sectionHeader: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: C.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  viewAll: {
    color: C.brand,
    fontSize: 15,
    lineHeight: 20,
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
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    minHeight: 138,
  },
  serviceArt: {
    height: 74,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceLabel: {
    marginTop: 2,
    textAlign: 'center',
    color: C.text,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  cleanersTitle: {
    marginTop: 26,
    color: C.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cleanerCard: {
    marginTop: 14,
    height: 176,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#F2F3F5',
  },
  cleanerWall: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '46%',
    backgroundColor: '#F6F7FA',
  },
  cloth: {
    position: 'absolute',
    left: 28,
    top: -8,
    width: 58,
    height: 168,
    borderRadius: 10,
    backgroundColor: '#F0C24B',
    transform: [{ rotate: '-6deg' }],
  },
  clothShade: {
    position: 'absolute',
    left: 62,
    top: 10,
    width: 16,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#E0A82E',
    opacity: 0.55,
    transform: [{ rotate: '-6deg' }],
  },
  gloveLeft: {
    position: 'absolute',
    left: 18,
    bottom: -18,
    width: 78,
    height: 92,
    borderRadius: 36,
    backgroundColor: '#2A3A79',
    transform: [{ rotate: '-18deg' }],
  },
  gloveLeftThumb: {
    position: 'absolute',
    right: -6,
    top: 18,
    width: 22,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#1C2A5E',
    transform: [{ rotate: '28deg' }],
  },
  bottle: {
    position: 'absolute',
    right: 78,
    top: 36,
    width: 46,
    height: 92,
    borderRadius: 12,
    backgroundColor: '#7EC8EE',
    overflow: 'hidden',
    alignItems: 'center',
  },
  bottleLiquid: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 58,
    backgroundColor: '#4AA3D8',
  },
  bottleNeck: {
    position: 'absolute',
    top: -10,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#E23B2F',
  },
  trigger: {
    position: 'absolute',
    top: -2,
    right: -14,
    width: 22,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E23B2F',
  },
  nozzle: {
    position: 'absolute',
    top: -16,
    width: 8,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#C43228',
  },
  forearm: {
    position: 'absolute',
    right: -20,
    top: 28,
    width: 120,
    height: 54,
    borderRadius: 28,
    backgroundColor: '#3B4A8C',
    transform: [{ rotate: '-8deg' }],
  },
  gloveRight: {
    position: 'absolute',
    right: 36,
    top: 48,
    width: 86,
    height: 70,
    borderRadius: 34,
    backgroundColor: '#2A3A79',
    transform: [{ rotate: '-16deg' }],
  },
  gloveRightThumb: {
    position: 'absolute',
    left: -4,
    top: 8,
    width: 22,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#1C2A5E',
    transform: [{ rotate: '-30deg' }],
  },
});

const art = StyleSheet.create({
  stage: {
    width: 86,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ladder: {
    position: 'absolute',
    top: 0,
    left: 22,
    width: 24,
    height: 34,
    zIndex: 2,
  },
  ladderRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 3,
    height: 34,
    borderRadius: 2,
    backgroundColor: '#D5DDE6',
  },
  ladderRailRight: {
    left: 16,
  },
  rung: {
    position: 'absolute',
    left: 0,
    width: 19,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#C5CED8',
  },
  pool: {
    position: 'absolute',
    left: 8,
    top: 22,
    width: 62,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#8FD4F5',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  poolRim: {
    position: 'absolute',
    top: 4,
    width: 50,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#B7E4FA',
  },
  water: {
    width: 48,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#3AA0E0',
    marginTop: 8,
  },
  net: {
    position: 'absolute',
    left: 0,
    bottom: 2,
    width: 28,
    height: 46,
    transform: [{ rotate: '-24deg' }],
  },
  netHead: {
    position: 'absolute',
    top: 0,
    left: 2,
    width: 18,
    height: 14,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#7EC4EA',
    backgroundColor: 'rgba(186, 224, 244, 0.45)',
  },
  netPole: {
    position: 'absolute',
    top: 12,
    left: 9,
    width: 3,
    height: 32,
    borderRadius: 2,
    backgroundColor: '#9FD4F0',
  },
  roller: {
    position: 'absolute',
    left: 6,
    top: 4,
    alignItems: 'center',
    transform: [{ rotate: '-32deg' }],
  },
  rollerHead: {
    width: 38,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F07820',
  },
  rollerNeck: {
    width: 7,
    height: 8,
    backgroundColor: '#C9864A',
    marginTop: -1,
  },
  rollerHandle: {
    width: 5,
    height: 30,
    borderRadius: 3,
    backgroundColor: '#D09A62',
  },
  bucket: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    width: 30,
    height: 32,
  },
  bucketBody: {
    position: 'absolute',
    left: 1,
    bottom: 0,
    width: 28,
    height: 22,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: '#F3A04A',
  },
  bucketPaint: {
    position: 'absolute',
    left: 3,
    bottom: 4,
    width: 24,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#FF8A1F',
  },
  bucketRim: {
    position: 'absolute',
    top: 4,
    left: 0,
    width: 30,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FFB15C',
  },
  drip: {
    position: 'absolute',
    right: -2,
    top: 12,
    width: 6,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#FF8A1F',
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E7C48A',
    marginBottom: -1,
  },
  house: {
    width: 52,
    height: 34,
    backgroundColor: '#F4E2C0',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    gap: 4,
  },
  beamRow: {
    position: 'absolute',
    top: 4,
    flexDirection: 'row',
    gap: 8,
  },
  beam: {
    width: 4,
    height: 26,
    borderRadius: 2,
    backgroundColor: '#E2C08A',
  },
  windowRow: {
    flexDirection: 'row',
    gap: 8,
  },
  window: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#FBF6EC',
    borderWidth: 1.5,
    borderColor: '#D7B27A',
  },
  chimney: {
    position: 'absolute',
    top: 2,
    right: 16,
    width: 8,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#E7C48A',
  },
  cable: {
    position: 'absolute',
    left: 2,
    top: 18,
    width: 28,
    height: 34,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#F5C534',
    borderBottomLeftRadius: 16,
  },
  outlet: {
    width: 54,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#C8C2B8',
    shadowOpacity: 0.45,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  socket: {
    width: 16,
    height: 22,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E4E1DC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 3,
  },
  pin: {
    width: 3,
    height: 6,
    borderRadius: 1,
    backgroundColor: '#C5C1BA',
  },
  ground: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#C5C1BA',
  },
  tileGrid: {
    width: 62,
    height: 62,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    transform: [{ rotate: '-8deg' }],
  },
  tile: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#E7D3B4',
  },
  tileAlt: {
    backgroundColor: '#F3E6D0',
  },
  trap: {
    position: 'absolute',
    left: 8,
    top: 14,
    width: 48,
    height: 40,
    borderLeftWidth: 9,
    borderBottomWidth: 9,
    borderRightWidth: 9,
    borderColor: '#3B9BFF',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 18,
  },
  trapInner: {
    position: 'absolute',
    left: 17,
    top: 24,
    width: 30,
    height: 22,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: '#7EC0FF',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 12,
  },
  wrench: {
    position: 'absolute',
    right: 2,
    bottom: 6,
    alignItems: 'center',
    transform: [{ rotate: '38deg' }],
  },
  wrenchHead: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C5CED6',
  },
  wrenchBar: {
    width: 5,
    height: 26,
    borderRadius: 3,
    backgroundColor: '#B7C2CC',
    marginTop: -2,
  },
});
