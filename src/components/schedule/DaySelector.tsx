/**
 * @param {number} selectedDay - Bat buoc, gia tri 2..8
 * @param {(day: number) => void} onSelectDay - Bat buoc
 */
import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {getWeekDays} from '../../utils/date';

type Props = {
  selectedDay: number;
  onSelectDay: (day: number) => void;
};

const DAYS = getWeekDays();

export default function DaySelector({selectedDay, onSelectDay}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrap}
      contentContainerStyle={styles.content}>
      {DAYS.map(day => {
        const active = day.value === selectedDay;
        return (
          <TouchableOpacity
            key={day.value}
            activeOpacity={0.8}
            onPress={() => onSelectDay(day.value)}
            accessibilityRole="button"
            accessibilityLabel={day.label}
            accessibilityState={{selected: active}}
            style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.text, active && styles.textActive]}>
              {day.label}
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
