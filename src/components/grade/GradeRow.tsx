/**
 * @param {Grade} grade - Bat buoc
 * @param {(grade: Grade) => void} onPress - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {Grade} from '../../types';

type Props = {
  grade: Grade;
  onPress: (grade: Grade) => void;
};

function GradeRow({grade, onPress}: Props) {
  const courseName = grade.course?.name ?? 'Mon hoc khong xac dinh';
  const credits = grade.course?.credits;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(grade)}
      accessibilityRole="button"
      accessibilityLabel={`Ket qua mon ${courseName}`}
      style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {courseName}
        </Text>
        <Text style={styles.credits}>
          {credits === undefined ? '--' : `${credits} tin chi`}
        </Text>
      </View>
      <Text style={styles.total}>{grade.total.toFixed(2)}</Text>
      <View style={styles.letterBox}>
        <Text style={styles.letter}>{grade.letter}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(GradeRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: spacing.touchTarget,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
  },
  credits: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  total: {
    ...typography.h3,
    color: colors.text,
  },
  letterBox: {
    minWidth: 40,
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  letter: {
    ...typography.captionBold,
    color: colors.primary,
  },
});
