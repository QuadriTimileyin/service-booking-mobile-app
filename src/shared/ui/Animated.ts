import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

/**
 * NativeWind only maps `className` for the components it knows about, and
 * Reanimated's animated views are not among them. Registering the mapping once
 * here lets animated views be styled with Tailwind classes like any other view.
 */
cssInterop(Animated.View, { className: 'style' });

export { Animated };
