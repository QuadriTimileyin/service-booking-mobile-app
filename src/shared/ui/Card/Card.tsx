import { View, type ViewProps } from 'react-native';

type CardTone = 'surface' | 'soft';

interface CardProps extends ViewProps {
  /** "soft" will tint the card in the brand colour, for a highlighted summary. */
  tone?: CardTone;
  className?: string;
}

const TONE: Record<CardTone, string> = {
  surface: 'border-line bg-surface',
  soft: 'border-primary/20 bg-primary-soft',
};

/** The one card style used everywhere: rounded, thin border, tone is picked here. */
export function Card({ tone = 'surface', className = '', children, ...rest }: CardProps) {
  return (
    <View className={`rounded-card border p-4 ${TONE[tone]} ${className}`} {...rest}>
      {children}
    </View>
  );
}
