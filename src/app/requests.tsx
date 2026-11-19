import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

/* ------------------------------------------------------------------ */
/* THEME (matched to the Home screen)                                  */
/* ------------------------------------------------------------------ */

const NAVY = '#171F57';
const NAVY_SOFT = '#2E3770';
const TINT = '#EEF1FA'; // selected / highlight fill
const SURFACE = '#F5F6FB'; // card fill (like the Popular Repairs tiles)
const BORDER = '#E8EAF3';
const WHITE = '#FFFFFF';
const BG = '#FFFFFF';
const MUTED = '#7F849B';
const DARK = '#12163A';
const STAR = '#F5A623';
const HEART = '#E5352B';

// Space reserved for the floating bottom tab bar (Home / Request / New / Reward / Profile)
// that overlays this screen. It sits on top of the device safe area, so this value is
// added to the bottom inset. Tweak it if your tab bar height changes.
const FLOATING_TAB_BAR_SPACE = 80;

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

const BRANDS = [
  'Apple', 'Dell', 'HP',
  'Lenovo', 'ASUS', 'Acer',
  'MSI', 'Samsung', 'LG',
  'Razer', 'Microsoft', 'Other',
];

const MODELS: Record<string, string[]> = {
  Dell: ['Inspiron Series', 'Vostro Series', 'Latitude Series', 'XPS Series', 'Alienware Series'],
  Apple: ['MacBook Air', 'MacBook Pro 13"', 'MacBook Pro 14"', 'MacBook Pro 16"'],
  HP: ['Pavilion Series', 'Envy Series', 'Spectre Series', 'Omen Series', 'ProBook Series'],
  Lenovo: ['IdeaPad Series', 'ThinkPad Series', 'Legion Series', 'Yoga Series'],
  ASUS: ['VivoBook Series', 'ZenBook Series', 'ROG Series', 'TUF Gaming Series'],
  Acer: ['Aspire Series', 'Swift Series', 'Nitro Series', 'Predator Series'],
  MSI: ['Modern Series', 'Katana Series', 'Raider Series', 'Stealth Series'],
  Samsung: ['Galaxy Book Series', 'Galaxy Book Pro'],
  LG: ['Gram Series', 'Ultra PC Series'],
  Razer: ['Blade 14', 'Blade 15', 'Blade 17'],
  Microsoft: ['Surface Laptop', 'Surface Book', 'Surface Pro'],
};

const ISSUES = [
  { name: 'Display', icon: '▣', price: 4999, specifics: ['Screen not turning on', 'Display flickering', 'Cracked screen', 'Lines on screen'] },
  { name: 'Battery', icon: '▱', price: 2499, specifics: ['Not charging', 'Drains quickly', 'Swollen battery', 'Random shutdowns'] },
  { name: 'Keyboard', icon: '⌨', price: 1999, specifics: ['Keys not working', 'Keys stuck', 'Backlight issue', 'Liquid spill'] },
  { name: 'Connectivity', icon: '⌁', price: 1499, specifics: ['Wi-Fi not working', 'Bluetooth issue', 'USB ports dead', 'No sound'] },
  { name: 'Performance', icon: '◉', price: 1799, specifics: ['Very slow', 'Overheating', 'Frequent crashes', 'Fan noise'] },
  { name: 'Other', icon: '＋', price: 999, specifics: ['Something else'] },
];

const INSPECTION_FEE = 499;

const SERVICES = [
  { name: 'Pickup & Drop', label: 'Pickup & Drop', icon: '⇄', fee: 199 },
  { name: 'Visit Shop', label: 'Visit Shop', icon: '⌂', fee: 0 },
  { name: 'Onsite', label: 'Onsite Repair', icon: '⚒', fee: 499 },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildDates = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { key: i, day: WEEKDAYS[d.getDay()], date: d.getDate() };
  });
};

const DATES = buildDates();

const TIMES = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

const formatPrice = (n: number) =>
  '₹' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/* ------------------------------------------------------------------ */
/* SMALL COMPONENTS (defined outside so inputs never remount)          */
/* ------------------------------------------------------------------ */

type SelectionCardProps = {
  title: string;
  selected: boolean;
  onPress: () => void;
  price?: string;
  icon?: string;
  style?: any;
};

function SelectionCard({ title, selected, onPress, price, icon, style }: SelectionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.selectionCard, selected && styles.selectedCard, style]}
    >
      {icon ? (
        <View style={[styles.iconTile, selected && styles.iconTileSelected]}>
          <Text style={[styles.selectionIcon, selected && { color: WHITE }]}>{icon}</Text>
        </View>
      ) : null}

      <Text style={[styles.selectionTitle, selected && styles.selectionTitleSelected]}>
        {title}
      </Text>

      {price ? <Text style={styles.selectionPrice}>{price}</Text> : null}
    </Pressable>
  );
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipActive]}>
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* SCREEN                                                              */
/* ------------------------------------------------------------------ */

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [booked, setBooked] = useState(false);
  const [favorite, setFavorite] = useState(true);

  const [brand, setBrand] = useState('Dell');
  const [model, setModel] = useState('Inspiron Series');
  const [unknownModel, setUnknownModel] = useState(false);

  const [issue, setIssue] = useState('Display');
  const [specificIssue, setSpecificIssue] = useState('Screen not turning on');
  const [description, setDescription] = useState('');
  const [unknownIssue, setUnknownIssue] = useState(false);
  const [photos, setPhotos] = useState(0);

  const [service, setService] = useState('Pickup & Drop');
  const [address, setAddress] = useState('Anna Nagar, Chennai - 600040');

  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  const [forSomeoneElse, setForSomeoneElse] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  /* ---------- derived values ---------- */

  const currentIssue = ISSUES.find((i) => i.name === issue) || ISSUES[0];
  const currentService = SERVICES.find((s) => s.name === service) || SERVICES[0];
  const repairPrice = unknownIssue ? INSPECTION_FEE : currentIssue.price;
  const total = repairPrice + currentService.fee;
  const deviceName = `${brand} ${unknownModel || !model ? 'Laptop' : model}`;
  const dateInfo = DATES[selectedDate];

  /* ---------- navigation ---------- */

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const previousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const resetFlow = () => {
    setBooked(false);
    setStep(1);
    setDescription('');
    setPhotos(0);
    setCustomerName('');
    setPhone('');
  };

  /* ---------- shared render helpers ---------- */

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4].map((item, index) => (
        <React.Fragment key={item}>
          <View style={[styles.progressCircle, step >= item && styles.progressActive]}>
            <Text style={[styles.progressText, step >= item && styles.progressTextActive]}>
              {step > item ? '✓' : item}
            </Text>
          </View>
          {index !== 3 && (
            <View style={[styles.progressLine, step > item && styles.progressLineActive]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderProductCard = () => (
    <View style={styles.productCard}>
      <View style={styles.laptopImage}>
        <Text style={styles.laptopEmoji}>💻</Text>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {deviceName}
        </Text>

        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingText}>4.8 (230 reviews)</Text>
        </View>

        <View style={styles.priceTag}>
          <Text style={styles.priceTagText}>
            Starting at {formatPrice(unknownIssue ? INSPECTION_FEE : currentIssue.price)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEstimateCard = () => (
    <View style={styles.estimateCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eyebrow}>ESTIMATED REPAIR COST</Text>
        <Text style={styles.estimateValue}>{formatPrice(repairPrice)}</Text>
        <Text style={styles.estimateDescription}>
          {unknownIssue ? 'Technician assessment required' : specificIssue}
        </Text>
      </View>
      <Text style={styles.estimateNote}>Final price confirmed{'\n'}after inspection</Text>
    </View>
  );

  /* ---------- STEP 1 : LAPTOP ---------- */

  const renderLaptopStep = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.fieldLabel}>Select Brand</Text>

        <View style={styles.brandGrid}>
          {BRANDS.map((item) => (
            <SelectionCard
              key={item}
              title={item}
              selected={brand === item}
              onPress={() => {
                setBrand(item);
                const list = MODELS[item];
                setModel(list ? list[0] : '');
                setUnknownModel(false);
              }}
              style={styles.brandCard}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>Select Model</Text>

        <View style={styles.modelInput}>
          <Text style={styles.modelInputIcon}>⌕</Text>
          <TextInput
            value={unknownModel ? '' : model}
            editable={!unknownModel}
            onChangeText={(value) => {
              setModel(value);
              setUnknownModel(false);
            }}
            placeholder="Search your laptop model"
            placeholderTextColor={MUTED}
            style={styles.modelTextInput}
          />
        </View>

        {MODELS[brand] && !unknownModel && (
          <View style={styles.chipWrap}>
            {MODELS[brand].map((item) => (
              <Chip
                key={item}
                label={item}
                selected={model === item}
                onPress={() => setModel(item)}
              />
            ))}
          </View>
        )}

        <Pressable
          onPress={() => setUnknownModel(!unknownModel)}
          style={[styles.unknownOption, unknownModel && styles.unknownOptionActive]}
        >
          <View style={styles.unknownIconWrap}>
            <Text style={styles.unknownIcon}>?</Text>
          </View>
          <Text style={styles.unknownText}>I don't know my model</Text>
          <View style={[styles.checkbox, unknownModel && styles.checkboxActive]}>
            {unknownModel && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </Pressable>
      </View>
    </>
  );

  /* ---------- STEP 2 : PROBLEM ---------- */

  const renderProblemStep = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.fieldLabel}>Do you know the problem?</Text>

        <View style={styles.twoColumn}>
          <Pressable
            onPress={() => setUnknownIssue(false)}
            style={[styles.choiceButton, !unknownIssue && styles.choiceActive]}
          >
            <Text style={[styles.choiceText, !unknownIssue && styles.choiceTextActive]}>
              Yes, I know
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setUnknownIssue(true)}
            style={[styles.choiceButton, unknownIssue && styles.choiceActive]}
          >
            <Text style={[styles.choiceText, unknownIssue && styles.choiceTextActive]}>
              Need help identifying
            </Text>
          </Pressable>
        </View>
      </View>

      {!unknownIssue && (
        <>
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Problem Category</Text>

            <View style={styles.issueGrid}>
              {ISSUES.map((item) => (
                <SelectionCard
                  key={item.name}
                  title={item.name}
                  icon={item.icon}
                  price={`from ${formatPrice(item.price)}`}
                  selected={issue === item.name}
                  onPress={() => {
                    setIssue(item.name);
                    setSpecificIssue(item.specifics[0]);
                  }}
                  style={styles.issueCard}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Specific Issue</Text>
            <View style={styles.chipWrap}>
              {currentIssue.specifics.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={specificIssue === item}
                  onPress={() => setSpecificIssue(item)}
                />
              ))}
            </View>
          </View>
        </>
      )}

      {renderEstimateCard()}

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>
          Add more details <Text style={styles.optional}>(optional)</Text>
        </Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue, what happened, etc."
          placeholderTextColor={MUTED}
          multiline
          textAlignVertical="top"
          style={styles.descriptionInput}
        />

        <Pressable
          style={styles.uploadButton}
          onPress={() => setPhotos((p) => (p >= 5 ? 0 : p + 1))}
        >
          <View style={styles.uploadIconWrap}>
            <Text style={styles.uploadIcon}>▧</Text>
          </View>
          <Text style={styles.uploadText}>
            Add Photos <Text style={styles.optional}>(optional)</Text>
          </Text>
          <Text style={styles.photoCount}>{photos}/5</Text>
        </Pressable>

        <Text style={styles.helperText}>
          Add up to 5 photos to help us understand the issue.
        </Text>
      </View>
    </>
  );

  /* ---------- STEP 3 : SERVICE & SCHEDULE ---------- */

  const renderServiceStep = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.fieldLabel}>Service Type</Text>

        <View style={styles.serviceGrid}>
          {SERVICES.map((item) => (
            <SelectionCard
              key={item.name}
              title={item.label}
              icon={item.icon}
              price={item.fee === 0 ? 'Free' : `+ ${formatPrice(item.fee)}`}
              selected={service === item.name}
              onPress={() => setService(item.name)}
              style={styles.serviceCard}
            />
          ))}
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>ⓘ</Text>
        <Text style={styles.infoText}>
          {service === 'Pickup & Drop'
            ? "We'll pick up your laptop, repair it and deliver it back."
            : service === 'Visit Shop'
            ? 'Visit our service centre and hand over your laptop.'
            : 'Our technician will visit your location.'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>
          {service === 'Visit Shop'
            ? 'Service Centre'
            : service === 'Onsite'
            ? 'Service Address'
            : 'Pickup Address'}
        </Text>

        <View style={styles.addressCard}>
          <View style={styles.addressIconWrap}>
            <Text style={styles.addressIcon}>⌖</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressTitle}>
              {service === 'Visit Shop' ? 'Chennai Service Centre' : 'Home'}
            </Text>
            {service === 'Visit Shop' ? (
              <Text style={styles.addressText}>T. Nagar, Chennai - 600017</Text>
            ) : (
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                placeholderTextColor={MUTED}
                style={styles.addressInput}
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>Select Date</Text>

        <View style={styles.dateRow}>
          {DATES.map((item) => {
            const active = selectedDate === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setSelectedDate(item.key)}
                style={[styles.dateCard, active && styles.dateCardActive]}
              >
                <Text style={[styles.dateDay, active && styles.dateDayActive]}>
                  {item.day}
                </Text>
                <View style={[styles.dateCircle, active && styles.dateCircleActive]}>
                  <Text style={[styles.dateNumber, active && styles.dateNumberActive]}>
                    {item.date}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>Select Time</Text>

        <View style={styles.chipWrap}>
          {TIMES.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={selectedTime === item}
              onPress={() => setSelectedTime(item)}
            />
          ))}
        </View>
      </View>
    </>
  );

  /* ---------- STEP 4 : REVIEW ---------- */

  const reviewRows = [
    { icon: '▣', title: 'Laptop', detail: deviceName, goTo: 1 },
    {
      icon: '⚒',
      title: 'Problem',
      detail: unknownIssue ? 'Needs technician assessment' : `${issue} • ${specificIssue}`,
      goTo: 2,
    },
    { icon: '⇄', title: 'Service', detail: service, goTo: 3 },
    {
      icon: '▦',
      title: 'Schedule',
      detail: `${dateInfo.day}, ${dateInfo.date} • ${selectedTime}`,
      goTo: 3,
    },
    {
      icon: '⌖',
      title: service === 'Visit Shop' ? 'Service Centre' : 'Address',
      detail: service === 'Visit Shop' ? 'Chennai Service Centre, T. Nagar' : address,
      goTo: 3,
    },
  ];

  const renderReviewStep = () => (
    <>
      <View style={styles.reviewCard}>
        {reviewRows.map((item, index) => (
          <View
            key={item.title}
            style={[
              styles.reviewRow,
              index === reviewRows.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.reviewIconWrap}>
              <Text style={styles.reviewIcon}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewTitle}>{item.title}</Text>
              <Text style={styles.reviewDetail}>{item.detail}</Text>
            </View>
            <Pressable onPress={() => setStep(item.goTo)} hitSlop={8}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.billCard}>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Repair estimate</Text>
          <Text style={styles.billValue}>{formatPrice(repairPrice)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>{service}</Text>
          <Text style={styles.billValue}>
            {currentService.fee === 0 ? 'Free' : formatPrice(currentService.fee)}
          </Text>
        </View>
        <View style={styles.billDivider} />
        <View style={styles.billRow}>
          <Text style={styles.billTotalLabel}>Total</Text>
          <Text style={styles.billTotalValue}>{formatPrice(total)}</Text>
        </View>
        <Text style={styles.priceNote}>Final price will be confirmed after inspection.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>Who is this request for?</Text>

        <View style={styles.twoColumn}>
          <Pressable
            onPress={() => setForSomeoneElse(false)}
            style={[styles.choiceButton, !forSomeoneElse && styles.choiceActive]}
          >
            <Text style={[styles.choiceText, !forSomeoneElse && styles.choiceTextActive]}>
              Myself
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setForSomeoneElse(true)}
            style={[styles.choiceButton, forSomeoneElse && styles.choiceActive]}
          >
            <Text style={[styles.choiceText, forSomeoneElse && styles.choiceTextActive]}>
              Someone Else
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.fieldLabel}>{forSomeoneElse ? 'Their Name' : 'Your Name'}</Text>
        <TextInput
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Enter name"
          placeholderTextColor={MUTED}
          style={styles.textInput}
        />

        <Text style={[styles.fieldLabel, { marginTop: 18 }]}>Phone Number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          placeholderTextColor={MUTED}
          keyboardType="phone-pad"
          style={styles.textInput}
        />
      </View>
    </>
  );

  /* ---------- CONFIRMATION ---------- */

  if (booked) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <View
          style={[
            styles.successWrap,
            { paddingBottom: insets.bottom + FLOATING_TAB_BAR_SPACE },
          ]}
        >
          <View style={styles.successCircle}>
            <Text style={styles.successTick}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Booking Confirmed</Text>
          <Text style={styles.successText}>
            Your {deviceName} repair is scheduled for {dateInfo.day}, {dateInfo.date} at{' '}
            {selectedTime}.
          </Text>

          <View style={styles.successCard}>
            <Text style={[styles.eyebrow, { color: MUTED }]}>TOTAL ESTIMATE</Text>
            <Text style={styles.successPrice}>{formatPrice(total)}</Text>
          </View>

          <Pressable style={[styles.primaryButton, { alignSelf: 'stretch' }]} onPress={resetFlow}>
            <Text style={styles.primaryButtonText}>Book another repair</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------- HEADER TEXT ---------- */

  const stepSubtitle =
    step === 1
      ? 'Tell us about your device'
      : step === 2
      ? 'Select the issue with your laptop'
      : step === 3
      ? 'Choose how and when you want the service'
      : 'Check your details before submitting';

  const stepTitle =
    step === 1
      ? 'Your Laptop'
      : step === 2
      ? "What's the Problem?"
      : step === 3
      ? 'Service & Schedule'
      : 'Review & Confirm';

  /* ---------- MAIN RENDER ---------- */

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={previousStep} style={styles.headerButton}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Book Service</Text>

          <Pressable onPress={() => setFavorite(!favorite)} style={styles.headerButton}>
            <Text style={[styles.heartIcon, !favorite && { color: '#C9CBD8' }]}>
              {favorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>

        {/* CONTENT */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderProductCard()}

          <View style={styles.progressWrapper}>{renderProgress()}</View>

          <SectionTitle subtitle={stepSubtitle}>{stepTitle}</SectionTitle>

          {step === 1 && renderLaptopStep()}
          {step === 2 && renderProblemStep()}
          {step === 3 && renderServiceStep()}
          {step === 4 && renderReviewStep()}
        </ScrollView>

        {/* BOTTOM BAR */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: insets.bottom + FLOATING_TAB_BAR_SPACE },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomLabel}>Total price</Text>
            <Text style={styles.bottomPrice}>{formatPrice(total)}</Text>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={step === 4 ? () => setBooked(true) : nextStep}
          >
            <Text style={styles.primaryButtonText}>
              {step === 4 ? 'Book Repair' : 'Continue'}
            </Text>
            <View style={styles.primaryArrow}>
              <Text style={styles.primaryArrowText}>{step === 4 ? '✓' : '→'}</Text>
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* STYLES                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  /* header */
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 30,
    lineHeight: 34,
    color: DARK,
    marginTop: -4,
  },
  heartIcon: {
    fontSize: 22,
    color: HEART,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DARK,
  },

  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
  },

  /* hero product card */
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    padding: 12,
  },
  laptopImage: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laptopEmoji: {
    fontSize: 46,
  },
  productInfo: {
    flex: 1,
    paddingLeft: 14,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK,
    letterSpacing: -0.3,
    lineHeight: 23,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 5,
  },
  star: {
    fontSize: 15,
    color: STAR,
  },
  ratingText: {
    fontSize: 12,
    color: MUTED,
  },
  priceTag: {
    alignSelf: 'flex-start',
    backgroundColor: NAVY,
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  priceTagText: {
    fontSize: 12,
    color: WHITE,
    fontWeight: '600',
  },

  /* progress */
  progressWrapper: {
    paddingHorizontal: 6,
    paddingVertical: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WHITE,
  },
  progressActive: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  progressText: {
    fontSize: 12,
    color: MUTED,
    fontWeight: '600',
  },
  progressTextActive: {
    color: WHITE,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: BORDER,
    marginHorizontal: 4,
    borderRadius: 1,
  },
  progressLineActive: {
    backgroundColor: NAVY,
  },

  /* section titles */
  sectionTitleContainer: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DARK,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK,
    marginBottom: 12,
  },
  optional: {
    color: MUTED,
    fontWeight: '400',
  },

  /* selection cards */
  selectionCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    borderColor: NAVY,
    borderWidth: 1.5,
    backgroundColor: TINT,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconTileSelected: {
    backgroundColor: NAVY,
  },
  selectionIcon: {
    fontSize: 19,
    color: NAVY,
  },
  selectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: DARK,
    textAlign: 'center',
  },
  selectionTitleSelected: {
    color: NAVY,
    fontWeight: '700',
  },
  selectionPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
    marginTop: 6,
    textAlign: 'center',
  },

  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brandCard: {
    width: '31.5%',
    minHeight: 52,
    paddingVertical: 14,
    borderRadius: 18,
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  issueCard: {
    width: '31.5%',
    minHeight: 120,
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  serviceGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  serviceCard: {
    flex: 1,
    minHeight: 124,
    paddingVertical: 14,
    paddingHorizontal: 6,
  },

  /* chips */
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipActive: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  chipText: {
    fontSize: 13,
    color: DARK,
  },
  chipTextActive: {
    color: WHITE,
    fontWeight: '600',
  },

  /* model input */
  modelInput: {
    height: 52,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    borderRadius: 26,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  modelInputIcon: {
    fontSize: 20,
    color: MUTED,
  },
  modelTextInput: {
    flex: 1,
    fontSize: 14,
    color: DARK,
  },
  unknownOption: {
    marginTop: 14,
    height: 56,
    borderRadius: 20,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  unknownOptionActive: {
    borderColor: NAVY,
    backgroundColor: TINT,
  },
  unknownIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unknownIcon: {
    fontSize: 15,
    color: NAVY,
    fontWeight: '700',
  },
  unknownText: {
    flex: 1,
    fontSize: 14,
    color: DARK,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C9CBD8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  checkmark: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },

  /* segmented choice */
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceActive: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  choiceText: {
    fontSize: 13,
    color: DARK,
  },
  choiceTextActive: {
    color: WHITE,
    fontWeight: '600',
  },

  /* estimate card */
  estimateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
    backgroundColor: NAVY,
    marginBottom: 24,
    gap: 10,
  },
  eyebrow: {
    fontSize: 11,
    color: '#A9B0D6',
    fontWeight: '700',
    letterSpacing: 1,
  },
  estimateValue: {
    fontSize: 26,
    fontWeight: '700',
    color: WHITE,
    marginTop: 6,
  },
  estimateDescription: {
    fontSize: 13,
    color: '#D7DBF0',
    marginTop: 4,
  },
  estimateNote: {
    fontSize: 10,
    color: '#A9B0D6',
    textAlign: 'right',
    lineHeight: 14,
  },

  /* description + photos */
  descriptionInput: {
    height: 96,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    fontSize: 14,
    color: DARK,
  },
  uploadButton: {
    height: 56,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 12,
    gap: 12,
  },
  uploadIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 17,
    color: NAVY,
  },
  uploadText: {
    fontSize: 14,
    color: DARK,
    flex: 1,
  },
  photoCount: {
    color: MUTED,
    fontSize: 13,
    marginRight: 4,
  },
  helperText: {
    color: MUTED,
    fontSize: 11,
    marginTop: 10,
    marginLeft: 4,
  },

  /* info + address */
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TINT,
    borderRadius: 18,
    padding: 14,
    gap: 10,
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 18,
    color: NAVY,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4A5070',
    lineHeight: 18,
  },
  addressCard: {
    minHeight: 68,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressIcon: {
    fontSize: 20,
    color: NAVY,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK,
  },
  addressText: {
    fontSize: 12,
    color: MUTED,
    marginTop: 3,
  },
  addressInput: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
    padding: 0,
  },

  /* date capsules */
  dateRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dateCard: {
    flex: 1,
    height: 92,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    alignItems: 'center',
    paddingTop: 11,
  },
  dateCardActive: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  dateDay: {
    fontSize: 11,
    color: MUTED,
  },
  dateDayActive: {
    color: WHITE,
    fontWeight: '500',
  },
  dateCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  dateCircleActive: {
    backgroundColor: WHITE,
  },
  dateNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: DARK,
  },
  dateNumberActive: {
    color: NAVY,
    fontWeight: '700',
  },

  /* review */
  reviewCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  reviewRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 12,
  },
  reviewIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewIcon: {
    fontSize: 17,
    color: NAVY,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK,
  },
  reviewDetail: {
    fontSize: 12,
    color: MUTED,
    marginTop: 3,
  },
  editText: {
    fontSize: 13,
    color: NAVY,
    fontWeight: '700',
  },
  billCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    padding: 18,
    marginBottom: 24,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 13,
    color: MUTED,
  },
  billValue: {
    fontSize: 14,
    color: DARK,
    fontWeight: '500',
  },
  billDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 6,
  },
  billTotalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: DARK,
  },
  billTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: NAVY,
  },
  priceNote: {
    fontSize: 11,
    color: MUTED,
    marginTop: 8,
  },
  textInput: {
    height: 52,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: WHITE,
    borderRadius: 26,
    paddingHorizontal: 20,
    fontSize: 14,
    color: DARK,
  },

  /* bottom bar */
  bottomBar: {
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F6',
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bottomLabel: {
    color: MUTED,
    fontSize: 12,
  },
  bottomPrice: {
    color: NAVY,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  primaryButton: {
    height: 54,
    minWidth: 176,
    paddingLeft: 24,
    paddingRight: 8,
    borderRadius: 27,
    backgroundColor: NAVY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  primaryButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
  primaryArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryArrowText: {
    color: NAVY,
    fontSize: 18,
    fontWeight: '700',
  },

  /* success */
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  successCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successTick: {
    fontSize: 42,
    color: NAVY,
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: DARK,
    letterSpacing: -0.5,
  },
  successText: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 21,
  },
  successCard: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 22,
    paddingVertical: 18,
    marginTop: 8,
    marginBottom: 12,
  },
  successPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: NAVY,
    marginTop: 6,
  },
});