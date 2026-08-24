import { forwardRef, useId, useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '../../config/theme';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, containerClassName = '', onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const errorId = useId();

  const borderClass = error
    ? 'border-danger'
    : focused
      ? 'border-primary'
      : 'border-line';

  return (
    <View className={containerClassName}>
      <Text nativeID={`${errorId}-label`} className="mb-2 text-sm font-medium text-ink">
        {label}
      </Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityLabelledBy={`${errorId}-label`}
        accessibilityHint={hint}
        placeholderTextColor={colors.inkMuted}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={`min-h-[52px] rounded-control border bg-surface px-4 py-3 text-base text-ink ${borderClass}`}
        {...rest}
      />
      {error ? (
        <Text accessibilityLiveRegion="polite" className="mt-1.5 text-sm text-danger">
          {error}
        </Text>
      ) : hint ? (
        <Text className="mt-1.5 text-sm text-ink-muted">{hint}</Text>
      ) : null}
    </View>
  );
});
