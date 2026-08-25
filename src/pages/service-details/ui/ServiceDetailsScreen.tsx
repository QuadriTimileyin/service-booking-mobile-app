import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Text, View } from 'react-native';

import { useServiceProvider } from '../../../entities/service';
import { colors } from '../../../shared/config/theme';
import { getInitials } from '../../../shared/lib/formatting';
import type { ServicesStackParamList } from '../../../shared/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Screen,
  Skeleton,
} from '../../../shared/ui';

type Props = NativeStackScreenProps<ServicesStackParamList, 'ServiceDetails'>;

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View className="flex-row items-start gap-3 py-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
        <Ionicons name={icon} size={17} color={colors.inkMuted} />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </Text>
        <Text className="mt-0.5 text-base text-ink">{value}</Text>
      </View>
    </View>
  );
}

export function ServiceDetailsScreen({ route, navigation }: Props) {
  const { serviceId } = route.params;
  const {
    data: provider,
    isPending,
    isError,
    error,
    refetch,
  } = useServiceProvider(serviceId);

  if (isPending) {
    return (
      <Screen edges={[]} className="gap-4 px-4 pt-4">
        <Skeleton className="h-32 w-full rounded-card" />
        <Skeleton className="h-48 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen edges={[]}>
        <ErrorState
          message={error?.message ?? 'We could not load this provider.'}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  if (!provider) {
    return (
      <Screen edges={[]}>
        <EmptyState
          icon="alert-circle-outline"
          title="Provider unavailable"
          description="This service provider is no longer listed."
          actionLabel="Back to services"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']}>
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
              <Text className="text-xl font-bold text-primary-dark">
                {getInitials(provider.name)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-ink">{provider.name}</Text>
              <Text className="mt-0.5 text-sm text-ink-muted">
                {provider.companyName}
              </Text>
              <View className="mt-2">
                <Badge label={provider.category} />
              </View>
            </View>
          </View>
        </Card>

        <Card className="py-1">
          <DetailRow icon="call-outline" label="Phone" value={provider.phone} />
          <View className="h-px bg-line" />
          <DetailRow icon="mail-outline" label="Email" value={provider.email} />
          <View className="h-px bg-line" />
          <DetailRow icon="location-outline" label="Address" value={provider.address} />
          <View className="h-px bg-line" />
          <DetailRow
            icon="business-outline"
            label="Company"
            value={provider.companyName}
          />
        </Card>

        <Card>
          <Text className="text-base font-semibold text-ink">About this service</Text>
          <Text className="mt-2 text-sm leading-6 text-ink-muted">
            {provider.description}
          </Text>
        </Card>
      </ScrollView>

      <View className="border-t border-line bg-surface px-4 pb-3 pt-3">
        <Button
          label="Book Service"
          onPress={() => navigation.navigate('Booking', { serviceId: provider.id })}
          testID="book-service"
        />
      </View>
    </Screen>
  );
}
