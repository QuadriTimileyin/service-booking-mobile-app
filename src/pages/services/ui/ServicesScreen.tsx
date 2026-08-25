import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { useServiceProviders, type ServiceProvider } from '../../../entities/service';
import { selectProfile, useUserStore } from '../../../entities/user';
import { useServiceFilters } from '../../../features/services/filter-services';
import { colors } from '../../../shared/config/theme';
import type { ServicesStackParamList } from '../../../shared/types';
import { EmptyState, ErrorState, Screen, ServiceListSkeleton } from '../../../shared/ui';
import { CategoryFilter } from '../../../widgets/category-filter';
import { HomeHero } from '../../../widgets/home-hero';
import { ScreenHeader } from '../../../widgets/screen-header';
import { ServiceCard } from '../../../widgets/service-card';
import { ServicesSearch } from '../../../widgets/services-search';

type Props = NativeStackScreenProps<ServicesStackParamList, 'Services'>;

export function ServicesScreen({ navigation }: Props) {
  const { data, isPending, isError, error, refetch, isRefetching } =
    useServiceProviders();
  const { query, setQuery, category, setCategory, results, isFiltering, clearFilters } =
    useServiceFilters(data);

  const profile = useUserStore(selectProfile);
  const firstName = profile?.name.split(' ')[0];

  const listRef = useRef<FlatList<ServiceProvider>>(null);

  // A shorter list keeps the old scroll offset, which leaves a blank gap on top.
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [query, category]);

  const openDetails = useCallback(
    (provider: ServiceProvider) =>
      navigation.navigate('ServiceDetails', { serviceId: provider.id }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ServiceProvider }) => (
      <View className="px-4">
        <ServiceCard provider={item} onPress={openDetails} />
      </View>
    ),
    [openDetails],
  );

  return (
    <Screen>
      <ScreenHeader
        title={firstName ? `Hello, ${firstName} 👋` : 'Find a service'}
        subtitle="What service do you need today?"
      />

      <ServicesSearch value={query} onChange={setQuery} />

      <View className="pt-3">
        <Text className="mb-2 px-4 text-base font-semibold text-ink">
          Browse by category
        </Text>
        <CategoryFilter value={category} onChange={setCategory} />
      </View>

      {isPending ? (
        <ServiceListSkeleton />
      ) : isError ? (
        <ErrorState
          title="We couldn't load services"
          message={error?.message ?? 'Check your connection and try again.'}
          onRetry={() => void refetch()}
          retrying={isRefetching}
        />
      ) : (
        <FlatList
          ref={listRef}
          data={results}
          keyExtractor={(provider) => String(provider.id)}
          renderItem={renderItem}
          contentContainerClassName="gap-3 pb-8"
          contentContainerStyle={results.length === 0 ? { flexGrow: 1 } : undefined}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="gap-4 pb-1 pt-4">
              <View className="px-4">
                <HomeHero />
              </View>

              {results.length > 0 ? (
                <View className="flex-row items-baseline justify-between px-4">
                  <Text className="text-base font-semibold text-ink">
                    Service providers
                  </Text>
                  <Text className="text-sm text-ink-muted">
                    {results.length} available
                  </Text>
                </View>
              ) : null}
            </View>
          }
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
                    ? 'Try another search or clear your category filter.'
                    : 'There are no service providers available right now.'
                }
                actionLabel={isFiltering ? 'Clear filters' : undefined}
                onAction={isFiltering ? clearFilters : undefined}
              />
            </View>
          }
          testID="services-list"
        />
      )}
    </Screen>
  );
}
