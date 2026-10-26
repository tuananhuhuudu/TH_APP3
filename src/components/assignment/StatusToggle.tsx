/**
 * @param {AssignmentStatus} status - Bat buoc
 * @param {() => void} onToggle - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {AssignmentStatus} from '../../types';

type Props = {
  status: AssignmentStatus;
  onToggle: () => void;
};

export default function StatusToggle({status, onToggle}: Props) {
  const done = status === 'done';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityLabel={
        done ? 'Danh dau chua hoan thanh' : 'Danh dau da hoan thanh'
      }
      accessibilityState={{checked: done}}
      style={[styles.box, done && styles.boxDone]}>
      <Text style={[styles.mark, done && styles.markDone]}>
        {done ? 'V' : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDone: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  mark: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  markDone: {
    color: colors.success,
  },
});
