/**
 * @param {string} title - Bat buoc
 * @param {() => void} onPress - Bat buoc
 * @param {'primary' | 'outline'} [variant] - Mac dinh "primary"
 * @param {boolean} [loading]
 * @param {boolean} [disabled]
 */
import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: Props) {
  const isOutline = variant === 'outline';
  const blocked = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={blocked}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{disabled: blocked, busy: loading}}
      style={[
        styles.base,
        isOutline ? styles.outline : styles.primary,
        blocked && styles.blocked,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.text, isOutline && styles.textOutline]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: spacing.touchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  blocked: {
    opacity: 0.5,
  },
  text: {
    ...typography.bodyBold,
    color: colors.white,
  },
  textOutline: {
    color: colors.primary,
  },
});
