// VerseScreen.tsx
import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type VerseScreenProps = {
  onBack: () => void;
  isDarkMode: boolean;
};

const CARD_COUNT = 6;

const CARD_CONTENT = [
  {
    title: 'Kamera-Vorlage',
    text: 'Öffne deine Kamera, um ein Foto als Hintergrund zu machen.',
    showCameraButton: true,
  },
  {
    title: 'Bibelvers des Tages:',
    text: '„Wer anderen eine Gräbe grubt, sich selber in die Hose pupt.“',
    showCameraButton: false,
  },
  {
    title: 'Bibelvers des Tages:',
    text: '„Wer anderen eine Gräbe grubt, sich selber in die Hose pupt.“',
    showCameraButton: false,
  },
  {
    title: 'Design 4',
    text: 'Hier entsteht später ein weiteres Kartendesign.',
    showCameraButton: false,
  },
  {
    title: 'Design 5',
    text: 'Hier entsteht später ein weiteres Kartendesign.',
    showCameraButton: false,
  },
  {
    title: 'Design 6',
    text: 'Hier entsteht später ein weiteres Kartendesign.',
    showCameraButton: false,
  },
];

const VerseScreen: React.FC<VerseScreenProps> = ({ onBack, isDarkMode }) => {
  // wir *wollen* auf Card 2 starten
  const [activeIndex, setActiveIndex] = useState(1);
  const [pageHeight, setPageHeight] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const hasInitialScroll = useRef(false); // damit wir nur einmal automatisch scrollen

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
    cameraBg: '#3b82f6',
    cameraText: '#ffffff',
  };

  const lightCard = {
    bg: '#ffffff',
    shadow: '#000000',
    logo: '#020617',
    title: '#020617',
    text: '#1f2937',
    footer: '#020617',
    cameraBg: '#e5e7eb',
    cameraText: '#111827',
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

  const onCameraPress = () => {
    console.log('Kamera öffnen');
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

                    {card.showCameraButton && (
                      <Pressable
                        style={[
                          styles.cameraButton,
                          { backgroundColor: cardPalette.cameraBg },
                        ]}
                        onPress={onCameraPress}
                      >
                        <Text
                          style={[
                            styles.cameraButtonText,
                            { color: cardPalette.cameraText },
                          ]}
                        >
                          Kamera öffnen
                        </Text>
                      </Pressable>
                    )}

                    <Text
                      style={[
                        styles.cardFooter,
                        { color: cardPalette.footer },
                      ]}
                    >
                      MyLittleChurch
                    </Text>
                  </View>
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
    paddingHorizontal: 12, // etwas weniger Rand – Cards dürfen breiter sein
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
    width: '82%', // größer
    height: '82%', // höher
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 18,
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

  cameraButton: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 999,
    marginBottom: 24,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
});