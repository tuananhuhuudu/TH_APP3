import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../utils/theme';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'danger';

type Props = {
  label: string;
  tone?: BadgeTone;
};

const toneStyles: Record<BadgeTone, {bg: string; text: string}> = {
  primary: {bg: colors.primarySoft, text: colors.primaryDark},
  success: {bg: colors.successSoft, text: colors.success},
  warning: {bg: colors.warningSoft, text: colors.warning},
  danger: {bg: colors.dangerSoft, text: colors.danger},
};

function StatusBadge({label, tone = 'primary'}: Props) {
  const palette = toneStyles[tone];
  return (
    <View style={[styles.badge, {backgroundColor: palette.bg}]}>
      <Text style={[styles.text, {color: palette.text}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default StatusBadge;
