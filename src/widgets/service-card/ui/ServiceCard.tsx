import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { ServiceProvider } from '../../../entities/service';
import { colors } from '../../../shared/config/theme';
import { getInitials } from '../../../shared/lib/formatting';
import { Badge, Button } from '../../../shared/ui';

interface ServiceCardProps {
  provider: ServiceProvider;
  onPress: (provider: ServiceProvider) => void;
}

function ServiceCardComponent({ provider, onPress }: ServiceCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${provider.name}, ${provider.companyName}, ${provider.category} in ${provider.city}`}
      accessibilityHint="Opens the provider details"
      onPress={() => onPress(provider)}
      className="rounded-card border border-line bg-surface p-4 active:bg-surface-muted"
      testID={`service-card-${provider.id}`}
    >
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
          <Text className="text-base font-bold text-primary-dark">
            {getInitials(provider.name)}
          </Text>
        </View>

        <View className="flex-1">
          <Text numberOfLines={1} className="text-base font-semibold text-ink">
            {provider.name}
          </Text>
          <Text numberOfLines={1} className="mt-0.5 text-sm text-ink-muted">
            {provider.companyName}
          </Text>
        </View>

        <Badge label={provider.category} />
      </View>

      <View className="mt-3 flex-row items-center gap-1.5">
        <Ionicons name="location-outline" size={14} color={colors.inkMuted} />
        <Text className="text-sm text-ink-muted">{provider.city}</Text>
      </View>

      {/* The whole card is pressable, but the button keeps the action obvious. */}
      <Button
        label="View Details"
        variant="secondary"
        size="md"
        onPress={() => onPress(provider)}
        className="mt-4"
        testID={`view-details-${provider.id}`}
      />
    </Pressable>
  );
}

export const ServiceCard = memo(ServiceCardComponent);
