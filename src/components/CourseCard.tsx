import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Course} from '../types';
import {colors} from '../utils/theme';

type Props = {
  course: Course;
  onPress: (course: Course) => void;
};

function CourseCard({course, onPress}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => onPress(course)}>
      <View style={styles.creditBox}>
        <Text style={styles.creditNumber}>{course.credits}</Text>
        <Text style={styles.creditLabel}>TC</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {course.name}
        </Text>
        <Text style={styles.code}>{course.code}</Text>
        {!!course.lecturer && (
          <Text style={styles.lecturer} numberOfLines={1}>
            {course.lecturer}
          </Text>
        )}
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
  creditBox: {
    width: 46,
    height: 46,
    borderRadius: 4,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  creditNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  creditLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  code: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  lecturer: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 28,
    color: colors.placeholder,
    marginLeft: 8,
  },
});

export default CourseCard;
