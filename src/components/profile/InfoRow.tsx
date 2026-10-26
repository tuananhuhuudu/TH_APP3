/**
 * @param {string} label - Bat buoc
 * @param {string} value - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = {
  label: string;
  value: string;
};

export default function InfoRow({label, value}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value || '--'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    width: 120,
  },
  value: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
});
