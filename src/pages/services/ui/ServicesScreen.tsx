import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useServiceProviders, type ServiceProvider } from '../../../entities/service';
import { useAuthStore } from '../../../entities/user';
import { useServiceFilters } from '../../../features/services/filter-services';
import { colors } from '../../../shared/config/theme';
import type { ServicesStackParamList } from '../../../shared/types';
import {
  EmptyState,
  ErrorState,
  IconButton,
  Screen,
  ServiceListSkeleton,
} from '../../../shared/ui';
import { CategoryFilter } from '../../../widgets/category-filter';
import { ScreenHeader } from '../../../widgets/screen-header';
import { ServiceCard } from '../../../widgets/service-card';
import { ServicesSearch } from '../../../widgets/services-search';

type Props = NativeStackScreenProps<ServicesStackParamList, 'Services'>;

export function ServicesScreen({ navigation }: Props) {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useServiceProviders();
  const { query, setQuery, category, setCategory, results, isFiltering, clearFilters } =
    useServiceFilters(data);

  const email = useAuthStore((state) => state.email);
  const signOut = useAuthStore((state) => state.signOut);

  const openDetails = useCallback(
    (provider: ServiceProvider) =>
      navigation.navigate('ServiceDetails', { serviceId: provider.id }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ServiceProvider }) => (
      <ServiceCard provider={item} onPress={openDetails} />
    ),
    [openDetails],
  );

  return (
    <Screen>
      <ScreenHeader
        title="Find a service"
        subtitle={email ? `Signed in as ${email}` : undefined}
        action={
          <IconButton accessibilityLabel="Sign out" onPress={signOut}>
            <Ionicons name="log-out-outline" size={22} color={colors.inkMuted} />
          </IconButton>
        }
      />

      <ServicesSearch value={query} onChange={setQuery} />
      <CategoryFilter value={category} onChange={setCategory} />

      {isPending ? (
        <ServiceListSkeleton />
      ) : isError ? (
        <ErrorState
          message={error?.message ?? 'We could not load services right now.'}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      ) : (
        <Animated.View entering={FadeIn.duration(200)} className="flex-1">
          <FlatList
            data={results}
            keyExtractor={(provider) => String(provider.id)}
            renderItem={renderItem}
            contentContainerClassName="gap-3 px-4 pb-8 pt-1"
            contentContainerStyle={results.length === 0 ? { flexGrow: 1 } : undefined}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => void refetch()}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <View className="flex-1">
                <EmptyState
                  icon="search-outline"
                  title="No services found"
                  description={
                    isFiltering
                      ? 'Try a different search term or category.'
                      : 'There are no service providers available right now.'
                  }
                  actionLabel={isFiltering ? 'Clear filters' : undefined}
                  onAction={isFiltering ? clearFilters : undefined}
                />
              </View>
            }
            testID="services-list"
          />
        </Animated.View>
      )}
    </Screen>
  );
}
