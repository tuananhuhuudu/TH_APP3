/**
 * @param {number} gpa - Bat buoc, he 4
 * @param {number} totalCredits - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = {
  gpa: number;
  totalCredits: number;
};

export default function GpaSummary({gpa, totalCredits}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.value}>{gpa.toFixed(2)}</Text>
        <Text style={styles.label}>GPA he 4</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.value}>{totalCredits}</Text>
        <Text style={styles.label}>Tin chi tich luy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  box: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    paddingVertical: spacing.lg,
  },
  value: {
    ...typography.h1,
    color: colors.primary,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
