import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { useServiceProvider } from '../../../entities/service';
import { BookingForm } from '../../../features/booking/create-booking';
import type { ServicesStackParamList } from '../../../shared/types';
import { EmptyState, ErrorState, Screen, Skeleton } from '../../../shared/ui';

type Props = NativeStackScreenProps<ServicesStackParamList, 'Booking'>;

export function BookingScreen({ route, navigation }: Props) {
  const { serviceId } = route.params;
  const {
    data: provider,
    isPending,
    isError,
    error,
    refetch,
  } = useServiceProvider(serviceId);

  const goToMyBookings = () => {
    // Send the stack back to the list so the tab does not reopen a finished form.
    navigation.popToTop();
    navigation.getParent()?.navigate('BookingsTab');
  };

  if (isPending) {
    return (
      <Screen edges={[]} className="gap-4 px-4 pt-4">
        <Skeleton className="h-28 w-full rounded-card" />
        <Skeleton className="h-14 w-full rounded-control" />
        <Skeleton className="h-14 w-full rounded-control" />
        <Skeleton className="h-28 w-full rounded-control" />
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
    <Screen edges={[]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-4 pb-10 pt-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BookingForm provider={provider} onBooked={goToMyBookings} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
