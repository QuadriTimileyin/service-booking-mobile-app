import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { useServiceProviders, type ServiceProvider } from '../../../entities/service';
import { selectProfile, useUserStore } from '../../../entities/user';
import { useServiceFilters } from '../../../features/services/filter-services';
import { colors } from '../../../shared/config/theme';
import type { ServicesStackParamList } from '../../../shared/types';
import { EmptyState, ErrorState, Screen, ServiceListSkeleton } from '../../../shared/ui';
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

  const profile = useUserStore(selectProfile);
  const firstName = profile?.name.split(' ')[0];

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
        title={firstName ? `Hello, ${firstName} 👋` : 'Find a service'}
        subtitle="What service do you need today?"
      />

      <ServicesSearch value={query} onChange={setQuery} />
      <CategoryFilter value={category} onChange={setCategory} />

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
          data={results}
          keyExtractor={(provider) => String(provider.id)}
          renderItem={renderItem}
          contentContainerClassName="gap-3 px-4 pb-8 pt-1"
          ListHeaderComponent={
            results.length > 0 ? (
              <View className="flex-row items-baseline justify-between pb-1 pt-1">
                <Text className="text-lg font-semibold text-ink">Service providers</Text>
                <Text className="text-sm text-ink-muted">{results.length} available</Text>
              </View>
            ) : null
          }
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
      )}
    </Screen>
  );
}
