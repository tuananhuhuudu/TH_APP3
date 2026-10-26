/**
 * @param {Assignment} assignment - Bat buoc
 * @param {boolean} [pending] - Dang cho dong bo
 * @param {(assignment: Assignment) => void} onPress - Bat buoc
 * @param {(assignment: Assignment) => void} onToggleStatus - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {Assignment} from '../../types';
import {formatDate, getDueLabel, isOverdue} from '../../utils/date';
import SyncBadge from '../common/SyncBadge';
import StatusToggle from './StatusToggle';

type Props = {
  assignment: Assignment;
  pending?: boolean;
  onPress: (assignment: Assignment) => void;
  onToggleStatus: (assignment: Assignment) => void;
};

function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}: Props) {
  const done = assignment.status === 'done';
  const overdue = !done && isOverdue(assignment.dueDate);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(assignment)}
      accessibilityRole="button"
      accessibilityLabel={`Bai tap ${assignment.title}`}
      style={styles.card}>
      <StatusToggle
        status={assignment.status}
        onToggle={() => onToggleStatus(assignment)}
      />
      <View style={styles.info}>
        <Text
          style={[styles.title, done && styles.titleDone]}
          numberOfLines={2}>
          {assignment.title}
        </Text>
        <Text style={styles.course} numberOfLines={1}>
          {assignment.course?.name ?? 'Mon hoc khong xac dinh'}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.due, overdue && styles.dueOverdue]}>
            {`${formatDate(assignment.dueDate)} - ${getDueLabel(
              assignment.dueDate,
            )}`}
          </Text>
        </View>
        <SyncBadge pending={pending} />
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(AssignmentItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
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
  title: {
    ...typography.bodyBold,
    color: colors.text,
  },
  titleDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  course: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  metaRow: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  due: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dueOverdue: {
    color: colors.danger,
    fontWeight: '600',
  },
});
