import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

/**
 * NativeWind does not map className on Reanimated views on its own.
 * So registering it once here will let animated views use Tailwind classes.
 */
cssInterop(Animated.View, { className: 'style' });

export { Animated };
