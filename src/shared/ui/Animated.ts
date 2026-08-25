import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

/**
 * NativeWind does not map className on Reanimated views on its own.
 * Registering it once here lets animated views use Tailwind classes.
 */
cssInterop(Animated.View, { className: 'style' });

export { Animated };
