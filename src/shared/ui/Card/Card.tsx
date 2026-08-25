import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  className?: string;
}

/** The one card style used everywhere: white, rounded, thin border. */
export function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <View
      className={`rounded-card border border-line bg-surface p-4 ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
}
