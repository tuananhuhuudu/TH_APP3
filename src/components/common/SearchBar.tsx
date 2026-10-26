/**
 * @param {string} value - Bat buoc
 * @param {(text: string) => void} onChangeText - Bat buoc
 * @param {string} [placeholder]
 */
import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tim kiem...',
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          style={styles.clear}
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Xoa noi dung tim kiem">
          <Text style={styles.clearText}>X</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    minHeight: spacing.touchTarget,
    ...typography.body,
    color: colors.text,
    padding: 0,
  },
  clear: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
});
