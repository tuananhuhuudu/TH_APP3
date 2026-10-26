/**
 * @param {Course} course - Bat buoc
 * @param {(course: Course) => void} onPress - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {Course} from '../../types';

type Props = {
  course: Course;
  onPress: (course: Course) => void;
};

function CourseCard({course, onPress}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(course)}
      accessibilityRole="button"
      accessibilityLabel={`Mon hoc ${course.name}`}
      style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.credits}>{`${course.credits} tin chi`}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {course.name}
      </Text>
      <Text style={styles.lecturer} numberOfLines={1}>
        {course.lecturer || '--'}
      </Text>
    </TouchableOpacity>
  );
}

export default React.memo(CourseCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  code: {
    ...typography.captionBold,
    color: colors.primary,
  },
  credits: {
    ...typography.caption,
    color: colors.textMuted,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
  },
  lecturer: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
