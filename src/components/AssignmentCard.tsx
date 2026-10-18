import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Assignment} from '../types';
import {daysUntil, formatDate, getDueLabel} from '../utils/helpers';
import {colors} from '../utils/theme';
import StatusBadge, {BadgeTone} from './StatusBadge';

type Props = {
  assignment: Assignment;
  courseName: string;
  onPress: (assignment: Assignment) => void;
  onToggle?: (id: string) => void;
};

function getDueTone(assignment: Assignment): BadgeTone {
  if (assignment.done) {
    return 'success';
  }
  const days = daysUntil(assignment.dueDate);
  if (days < 0) {
    return 'danger';
  }
  return days <= 3 ? 'warning' : 'primary';
}

function AssignmentCard({assignment, courseName, onPress, onToggle}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => onPress(assignment)}>
      {!!onToggle && (
        <TouchableOpacity
          style={[styles.checkbox, assignment.done && styles.checkboxDone]}
          onPress={() => onToggle(assignment.id)}
          hitSlop={8}>
          {assignment.done && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text
          style={[styles.title, assignment.done && styles.titleDone]}
          numberOfLines={2}>
          {assignment.title}
        </Text>
        <Text style={styles.course} numberOfLines={1}>
          {courseName}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.due}>Hạn: {formatDate(assignment.dueDate)}</Text>
          <StatusBadge
            label={getDueLabel(assignment)}
            tone={getDueTone(assignment)}
          />
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkMark: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  course: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  due: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 28,
    color: colors.placeholder,
    marginLeft: 8,
  },
});

export default AssignmentCard;
