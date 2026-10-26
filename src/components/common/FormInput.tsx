/**
 * @param {string} label - Bat buoc
 * @param {string} value - Bat buoc
 * @param {(text: string) => void} onChangeText - Bat buoc
 * @param {string} [error]
 * @param {KeyboardTypeOptions} [keyboardType]
 */
import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export default function FormInput({
  label,
  value,
  onChangeText,
  error = '',
  keyboardType = 'default',
  placeholder = '',
  multiline = false,
  autoCapitalize = 'sentences',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline, !!error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: spacing.touchTarget,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.inputBg,
    ...typography.body,
    color: colors.text,
  },
  multiline: {
    minHeight: 96,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
