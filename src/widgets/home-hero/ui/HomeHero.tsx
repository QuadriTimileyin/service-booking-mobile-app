import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '../../../shared/config/theme';

/** Sets the tone on the home screen. No prices or ratings */
export function HomeHero() {
  return (
    <View className="flex-row items-center gap-4 overflow-hidden rounded-card bg-primary p-5">
      <View className="flex-1">
        <Text className="text-lg font-bold leading-6 text-white">
          Reliable service.{'\n'}Trusted professionals.
        </Text>
        <Text className="mt-2 text-sm leading-5 text-white/80">
          Find and book help in minutes.
        </Text>
      </View>

      <View className="h-16 w-16 items-center justify-center rounded-full bg-white/15">
        <Ionicons name="construct-outline" size={30} color={colors.surface} />
      </View>
    </View>
  );
}
