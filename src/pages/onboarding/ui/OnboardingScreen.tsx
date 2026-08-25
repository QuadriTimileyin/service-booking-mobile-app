import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { usePreferencesStore } from '../../../entities/preferences';
import { Button, Screen } from '../../../shared/ui';
import {
  OnboardingSlide,
  type OnboardingSlideContent,
} from '../../../widgets/onboarding-slide';

const SLIDES: OnboardingSlideContent[] = [
  {
    icon: 'shield-checkmark-outline',
    title: 'Trusted services, right when you need them',
    body: 'Browse reliable local professionals for everyday services in just a few taps.',
  },
  {
    icon: 'search-outline',
    title: 'Find, choose and book with ease',
    body: 'Compare providers, pick a convenient date and time, and keep your bookings organised.',
  },
  {
    icon: 'calendar-outline',
    title: 'Your bookings, all in one place',
    body: 'Review upcoming appointments and manage your saved bookings whenever you need to.',
  },
];

export function OnboardingScreen() {
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);
  const listRef = useRef<FlatList<OnboardingSlideContent>>(null);
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();

  const isLast = index === SLIDES.length - 1;

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
    },
    [width],
  );

  const goNext = () => {
    if (isLast) {
      completeOnboarding();
      return;
    }
    listRef.current?.scrollToOffset({ offset: (index + 1) * width, animated: true });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View className="h-12 flex-row justify-end px-4">
        {!isLast ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            hitSlop={12}
            onPress={completeOnboarding}
            className="justify-center px-2"
          >
            <Text className="text-base font-medium text-ink-muted">Skip</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(slide) => slide.title}
        renderItem={({ item }) => <OnboardingSlide slide={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        testID="onboarding-slides"
      />

      <View className="flex-row justify-center gap-2 pb-8 pt-6">
        {SLIDES.map((slide, slideIndex) => (
          <View
            key={slide.title}
            className={`h-2 rounded-full ${
              slideIndex === index ? 'w-6 bg-primary' : 'w-2 bg-line'
            }`}
          />
        ))}
      </View>

      <View className="gap-3 px-6 pb-4">
        <Button
          label={isLast ? 'Get Started' : 'Next'}
          onPress={goNext}
          testID="onboarding-next"
        />
      </View>
    </Screen>
  );
}
