import { useEffect } from 'react';
import { View } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Animated } from '../Animated';

interface SkeletonProps {
  className?: string;
}

/** A single shimmering block. Compose these to mirror the real layout. */
export function Skeleton({ className = '' }: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={style} className={`rounded-lg bg-surface-muted ${className}`} />
  );
}

/** Placeholder that matches the shape of a `ServiceCard` while data loads. */
export function ServiceCardSkeleton() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="rounded-card border border-line bg-surface p-4"
    >
      <View className="flex-row items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </View>
      </View>
      <Skeleton className="mt-4 h-3 w-1/3" />
      <Skeleton className="mt-4 h-11 w-full rounded-control" />
    </View>
  );
}

export function ServiceListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading services"
      className="gap-3 px-4 pt-2"
    >
      {Array.from({ length: count }, (_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </View>
  );
}
