import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useId, useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '../../config/theme';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    hint,
    containerClassName = '',
    inputClassName = '',
    secureTextEntry,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
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

      <View className="justify-center">
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityLabelledBy={`${errorId}-label`}
          accessibilityHint={hint}
          placeholderTextColor={colors.inkMuted}
          secureTextEntry={secureTextEntry && !revealed}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          className={`min-h-[52px] rounded-control border bg-surface px-4 py-3 text-base text-ink ${borderClass} ${
            secureTextEntry ? 'pr-14' : ''
          } ${inputClassName}`}
          {...rest}
        />

        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            hitSlop={8}
            onPress={() => setRevealed((current) => !current)}
            className="absolute right-1 h-11 w-11 items-center justify-center"
          >
            <Ionicons
              name={revealed ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.inkMuted}
            />
          </Pressable>
        ) : null}
      </View>

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
