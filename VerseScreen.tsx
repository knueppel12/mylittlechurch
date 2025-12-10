// VerseScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Kamera (react-native-vision-camera)
import { Camera, useCameraDevices } from 'react-native-vision-camera';

type VerseScreenProps = {
  onBack: () => void;
  isDarkMode: boolean;
};

const CARD_CONTENT = [
  {
    title: 'Kamera-Vorlage',
    text: 'Öffne deine Kamera, um ein Foto als Hintergrund zu machen.',
  },
  {
    title: 'Bibelvers des Tages:',
    text: '„Wer anderen eine Gräbe grubt, sich selber in die Hose pupt.“',
  },
  {
    title: 'Bibelvers des Tages:',
    text: '„Wer anderen eine Gräbe grubt, sich selber in die Hose pupt.“',
  },
  {
    title: 'Design 4',
    text: 'Hier entsteht später ein weiteres Kartendesign.',
  },
  {
    title: 'Design 5',
    text: 'Hier entsteht später ein weiteres Kartendesign.',
  },
  {
    title: 'Design 6',
    text: 'Hier entsteht später ein weiteres Kartendesign.',
  },
];

const CARD_COUNT = CARD_CONTENT.length;

const VerseScreen: React.FC<VerseScreenProps> = ({ onBack, isDarkMode }) => {
  // Start auf Card 2
  const [activeIndex, setActiveIndex] = useState(1);
  const [pageHeight, setPageHeight] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const hasInitialScroll = useRef(false);

  // Kamera-Status
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const hasRequestedPermission = useRef(false);
  const cameraRef = useRef<Camera | null>(null);

  // Foto & Animation
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isFlashVisible, setIsFlashVisible] = useState(false);
  const shutterScale = useRef(new Animated.Value(1)).current;

  // Flash-Status
  const [flashEnabled, setFlashEnabled] = useState(false);

  // useCameraDevices: bei dir als Array typisiert → als Array behandeln
  const devices = useCameraDevices(); // CameraDevice[]
  const backCamera = Array.isArray(devices)
    ? devices.find(d => d.position === 'back')
    : undefined;

  // UI-Farben – Hintergrund, Buttons, Dots
  const uiPalette = isDarkMode
    ? {
        background: '#111827',
        headerButtonBg: '#1f2937',
        headerIcon: '#f9fafb',
        headerIconTint: '#f9fafb',
        dot: '#4b5563',
        dotActive: '#3b82f6',
      }
    : {
        background: '#f3f4f6',
        headerButtonBg: '#e5e7eb',
        headerIcon: '#111827',
        headerIconTint: '#111827',
        dot: '#4b5563',
        dotActive: '#3b82f6',
      };

  // Card-Farben
  const darkCard = {
    bg: '#020617',
    shadow: '#000000',
    logo: '#f9fafb',
    title: '#f9fafb',
    text: '#f9fafb',
    footer: '#f9fafb',
  };

  const lightCard = {
    bg: '#ffffff',
    shadow: '#000000',
    logo: '#020617',
    title: '#020617',
    text: '#1f2937',
    footer: '#020617',
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const containerHeight = e.nativeEvent.layoutMeasurement.height;
    const index = Math.round(offsetY / containerHeight);
    setActiveIndex(index);
  };

  const handleCardsLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setPageHeight(h);

    // direkt nach dem ersten Layout zur zweiten Karte (Index 1) springen
    if (!hasInitialScroll.current && scrollRef.current) {
      scrollRef.current.scrollTo({ y: h * 1, animated: false });
      hasInitialScroll.current = true;
      setActiveIndex(1);
    }
  };

  // Kamera automatisch an/aus je nach aktiver Card
  useEffect(() => {
    // auf anderen Cards Kamera stoppen, Foto aber behalten
    if (activeIndex !== 0) {
      setIsCameraActive(false);
      return;
    }

    (async () => {
      if (!hasRequestedPermission.current) {
        const status = (await Camera.requestCameraPermission()) as any;
        hasRequestedPermission.current = true;

        if (status !== 'authorized' && status !== 'granted') {
          setHasCameraPermission(false);
          setIsCameraActive(false);
          Alert.alert(
            'Kamera nicht verfügbar',
            'Bitte erlaube der App den Kamerazugriff in den iOS-Einstellungen.'
          );
          return;
        }

        setHasCameraPermission(true);
      }

      // nur Live-Kamera starten, wenn noch KEIN Foto existiert
      if (hasCameraPermission !== false && !photoUri) {
        setIsCameraActive(true);
      }
    })();
  }, [activeIndex, hasCameraPermission, photoUri]);

  // Foto aufnehmen
  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      // kleine Button-Bounce Animation
      Animated.sequence([
        Animated.timing(shutterScale, {
          toValue: 0.85,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shutterScale, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();

      // kurzer weißer Flash
      setIsFlashVisible(true);
      setTimeout(() => setIsFlashVisible(false), 120);

      const photo = await cameraRef.current.takePhoto({
        flash: flashEnabled ? 'on' : 'off',
      });

      const uri = photo?.path ? `file://${photo.path}` : undefined;
      if (uri) {
        setPhotoUri(uri);
        // Live-Bild aus → man sieht das Foto als Hintergrund
        setIsCameraActive(false);
      }
    } catch (e) {
      console.warn('Fehler beim Foto aufnehmen:', e);
    }
  };

  // Wiederholen-Pfeil → Foto löschen & Live-Kamera wieder aktivieren
  const handleRetake = () => {
    setPhotoUri(null);
    if (activeIndex === 0 && hasCameraPermission !== false && backCamera) {
      setIsCameraActive(true);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: uiPalette.background }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={[styles.roundButton, { backgroundColor: uiPalette.headerButtonBg }]}
          onPress={onBack}
        >
          <Text style={[styles.roundButtonIcon, { color: uiPalette.headerIcon }]}>
            ←
          </Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <Pressable
          style={[styles.roundButton, { backgroundColor: uiPalette.headerButtonBg }]}
        >
          <Image
            source={require('./assets/icons/customize-icon.png')}
            style={[styles.headerIcon, { tintColor: uiPalette.headerIconTint }]}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* CONTENT: Cards + Punkte */}
      <View style={styles.contentRow}>
        <View
          style={[styles.cardsWrapper, { backgroundColor: 'transparent' }]}
          onLayout={handleCardsLayout}
        >
          <ScrollView
            ref={scrollRef}
            style={[styles.cardsScroll, { backgroundColor: 'transparent' }]}
            contentContainerStyle={[
              styles.cardsScrollContent,
              { backgroundColor: 'transparent' },
            ]}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
          >
            {CARD_CONTENT.map((card, index) => {
              // Card 2 bekommt invertiertes Layout
              const cardThemeIsDark = index === 2 ? !isDarkMode : isDarkMode;
              const cardPalette = cardThemeIsDark ? darkCard : lightCard;
              const isCameraCard = index === 0;

              const showPhotoBackground = isCameraCard && photoUri;
              const showLiveCamera =
                isCameraCard &&
                isCameraActive &&
                hasCameraPermission !== false &&
                backCamera;

              return (
                <View
                  key={index.toString()}
                  style={[
                    styles.page,
                    { backgroundColor: 'transparent' },
                    pageHeight != null ? { height: pageHeight } : null,
                  ]}
                >
                  <View
                    style={[
                      styles.card,
                      {
                        backgroundColor: cardPalette.bg,
                        shadowColor: cardPalette.shadow,
                      },
                    ]}
                  >
                    {/* Hintergrund: Foto oder Kamera nur auf Card 0 */}
                    {showPhotoBackground && (
                      <Image
                        source={{ uri: photoUri! }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="cover"
                      />
                    )}

                    {!showPhotoBackground && showLiveCamera && (
                      <View style={StyleSheet.absoluteFill}>
                        <Camera
                          ref={cameraRef}
                          style={StyleSheet.absoluteFill}
                          device={backCamera!}
                          isActive={true}
                          photo={true} // wichtig für takePhoto()
                        />
                        {/* Abdunklung für bessere Lesbarkeit */}
                        <View
                          style={[
                            StyleSheet.absoluteFillObject,
                            { backgroundColor: 'rgba(0,0,0,0.25)' },
                          ]}
                        />
                      </View>
                    )}

                    {/* Weißer Shutter-Flash über Foto/Kamera */}
                    {isCameraCard && isFlashVisible && (
                      <View
                        style={[
                          StyleSheet.absoluteFillObject,
                          { backgroundColor: 'rgba(255,255,255,0.55)' },
                        ]}
                      />
                    )}

                    {/* Vordergrund-Inhalt */}
                    <Image
                      source={require('./assets/icons/church-logo.png')}
                      style={[styles.cardLogo, { tintColor: cardPalette.logo }]}
                      resizeMode="contain"
                    />

                    <Text
                      style={[
                        styles.cardTitle,
                        { color: cardPalette.title },
                      ]}
                    >
                      {card.title}
                    </Text>

                    <Text
                      style={[
                        styles.cardText,
                        { color: cardPalette.text },
                      ]}
                    >
                      {card.text}
                    </Text>

                    <Text
                      style={[
                        styles.cardFooter,
                        { color: cardPalette.footer },
                      ]}
                    >
                      MyLittleChurch
                    </Text>
                  </View>

                  {/* Kamera-Controls nur auf Kamera-Card (Index 0) */}
                  {isCameraCard && hasCameraPermission !== false && (
                    <View style={styles.cameraControlsRow}>
                      {/* Retake Button – links, absolut positioniert */}
                      {photoUri && (
                        <Pressable
                          style={[
                            styles.retakeButton,
                            {
                              backgroundColor: uiPalette.headerButtonBg,
                              position: 'absolute',
                              left: '20%',
                            },
                          ]}
                          onPress={handleRetake}
                        >
                          <Text
                            style={[
                              styles.retakeIcon,
                              { color: uiPalette.headerIcon },
                            ]}
                          >
                            ↻
                          </Text>
                        </Pressable>
                      )}

                      {/* Flash Button – rechts, mit flash-icon.png */}
                      <Pressable
                        onPress={() => setFlashEnabled(v => !v)}
                        style={[
                          styles.flashButton,
                          flashEnabled
                            ? {
                                backgroundColor: isDarkMode ? '#ffffff' : '#111827',
                              }
                            : { backgroundColor: uiPalette.headerButtonBg },
                          { position: 'absolute', right: '20%' },
                        ]}
                      >
                        <Image
                          source={require('./assets/icons/flash-icon.png')}
                          style={[
                            styles.flashIcon,
                            flashEnabled
                              ? { tintColor: isDarkMode ? '#111827' : '#ffffff' }
                              : { tintColor: uiPalette.headerIcon },
                          ]}
                          resizeMode="contain"
                        />
                      </Pressable>

                      {/* Capture Button – IMMER zentriert */}
                      <Animated.View
                        style={[
                          styles.captureButton,
                          {
                            transform: [{ scale: shutterScale }],
                            backgroundColor: uiPalette.headerButtonBg,
                          },
                        ]}
                      >
                        <Pressable
                          onPress={handleCapture}
                          style={styles.captureInner}
                        >
                          <Image
                            source={require('./assets/icons/capture-icon.png')}
                            style={[
                              styles.captureIcon,
                              { tintColor: uiPalette.headerIcon },
                            ]}
                            resizeMode="contain"
                          />
                        </Pressable>
                      </Animated.View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Punkt-Leiste rechts */}
        <View style={styles.dotsContainer}>
          {Array.from({ length: CARD_COUNT }).map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                { backgroundColor: uiPalette.dot, opacity: 0.4 },
                idx === activeIndex && {
                  backgroundColor: uiPalette.dotActive,
                  opacity: 1,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* BOTTOM BUTTONS – im Style der Header-Buttons */}
      <View style={styles.bottomRow}>
        <Pressable
          style={[
            styles.roundButton,
            { backgroundColor: uiPalette.headerButtonBg },
          ]}
        >
          <Text
            style={[
              styles.roundButtonIcon,
              { color: uiPalette.headerIcon },
            ]}
          >
            i
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.roundButton,
            { backgroundColor: uiPalette.headerButtonBg },
          ]}
        >
          <Text
            style={[
              styles.roundButtonIcon,
              { color: uiPalette.headerIcon },
            ]}
          >
            ↗︎
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default VerseScreen;

/* ──────────────────────────────────────────────
   STYLES
────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  roundButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonIcon: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerIcon: {
    width: 22,
    height: 22,
  },

  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardsWrapper: {
    flex: 1,
    overflow: 'visible',
  },
  cardsScroll: {
    flex: 1,
  },
  cardsScrollContent: {
    flexGrow: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '82%',
    height: '82%',
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 18,
    overflow: 'hidden', // Kamera/Foto bleibt in der Card
  },
  cardLogo: {
    width: 46,
    height: 46,
    marginTop: 8,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 32,
  },
  cardFooter: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  dotsContainer: {
    width: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginVertical: 5,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  cameraControlsRow: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  retakeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeIcon: {
    fontSize: 20,
    fontWeight: '600',
  },

  flashButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashIcon: {
    width: 28,
    height: 28,
  },

  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureIcon: {
    width: 70,
    height: 70,
  },
});