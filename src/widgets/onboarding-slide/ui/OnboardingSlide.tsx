import { Ionicons } from '@expo/vector-icons';
import { Text, View, useWindowDimensions } from 'react-native';

import { colors } from '../../../shared/config/theme';

export interface OnboardingSlideContent {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}

interface OnboardingSlideProps {
  slide: OnboardingSlideContent;
}

/** One onboarding page. Sized to the screen so paging lands cleanly. */
export function OnboardingSlide({ slide }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width }} className="items-center justify-center px-8">
      <View className="h-44 w-44 items-center justify-center rounded-full bg-primary-soft">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-surface">
          <Ionicons name={slide.icon} size={52} color={colors.primary} />
        </View>
      </View>

      <Text
        accessibilityRole="header"
        className="mt-10 text-center text-[26px] font-bold leading-8 text-ink"
      >
        {slide.title}
      </Text>
      <Text className="mt-3 text-center text-base leading-6 text-ink-muted">
        {slide.body}
      </Text>
    </View>
  );
}
