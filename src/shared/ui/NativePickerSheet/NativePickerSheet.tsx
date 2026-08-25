import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';

interface SheetProps {
  mode: 'date' | 'time';
  title: string;
  /** Starting value for the picker. */
  value: Date;
  minimumDate?: Date;
  onConfirm: (value: Date) => void;
  onDismiss: () => void;
}

/**
 * The platform date and time picker.
 * Android opens its own dialog. iOS gets the spinner in a sheet with Done.
 */
export function NativePickerSheet({ open, ...props }: SheetProps & { open: boolean }) {
  // Mounting only while open gives the sheet a fresh draft every time.
  return open ? <PickerSheet {...props} /> : null;
}

function PickerSheet({
  mode,
  title,
  value,
  minimumDate,
  onConfirm,
  onDismiss,
}: SheetProps) {
  const [draft, setDraft] = useState(value);

  const handleAndroidChange = (event: DateTimePickerEvent, date?: Date) => {
    onDismiss();
    if (event.type === 'set' && date) onConfirm(date);
  };

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={draft}
        mode={mode}
        minimumDate={minimumDate}
        display="default"
        onChange={handleAndroidChange}
      />
    );
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss picker"
        onPress={onDismiss}
        className="flex-1 bg-black/40"
      />
      <View className="bg-surface pb-8">
        <View className="flex-row items-center justify-between border-b border-line px-4 py-3">
          <Pressable accessibilityRole="button" onPress={onDismiss} hitSlop={8}>
            <Text className="text-base text-ink-muted">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-ink">{title}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => onConfirm(draft)}
            hitSlop={8}
          >
            <Text className="text-base font-semibold text-primary">Done</Text>
          </Pressable>
        </View>

        <DateTimePicker
          value={draft}
          mode={mode}
          minimumDate={minimumDate}
          display="spinner"
          onChange={(_event, date) => date && setDraft(date)}
        />
      </View>
    </Modal>
  );
}
