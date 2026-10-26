/**
 * @param {{value: string, label: string}[]} options - Bat buoc
 * @param {string} selected - Bat buoc
 * @param {(value: string) => void} onSelect - Bat buoc
 */
import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export type FilterOption = {
  value: string;
  label: string;
};

type Props = {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function FilterChips({options, selected, onSelect}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrap}
      contentContainerStyle={styles.content}>
      {options.map(option => {
        const active = option.value === selected;
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.8}
            onPress={() => onSelect(option.value)}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{selected: active}}
            style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.text, active && styles.textActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 0,
  },
  content: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    minHeight: spacing.touchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  textActive: {
    color: colors.white,
  },
});
