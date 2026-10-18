import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AssignmentCard from '../components/AssignmentCard';
import EmptyState from '../components/EmptyState';
import InfoRow from '../components/InfoRow';
import SectionHeader from '../components/SectionHeader';
import SessionCard from '../components/SessionCard';
import StatusBadge from '../components/StatusBadge';
import {useApp} from '../data/AppContext';
import {RootStackParamList} from '../navigation/types';
import {Assignment, ClassSession} from '../types';
import {getWeekdayLabel, orDash} from '../utils/helpers';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'CourseDetail'>;

function CourseDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const {course} = useRoute<Route>().params;
  const insets = useSafeAreaInsets();
  const {sessions, assignments, grades, toggleAssignment} = useApp();

  const courseSessions = useMemo(
    () =>
      sessions
        .filter(item => item.courseId === course.id)
        .sort((a, b) => a.weekday - b.weekday),
    [sessions, course.id],
  );

  const courseAssignments = useMemo(
    () =>
      assignments
        .filter(item => item.courseId === course.id)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [assignments, course.id],
  );

  const grade = useMemo(
    () => grades.find(item => item.courseId === course.id),
    [grades, course.id],
  );

  function openSession(session: ClassSession) {
    navigation.navigate('SessionDetail', {session});
  }

  function openAssignment(assignment: Assignment) {
    navigation.navigate('AssignmentDetail', {assignment});
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {paddingBottom: insets.bottom + 24},
      ]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.code}>{course.code}</Text>
        <Text style={styles.name}>{course.name}</Text>
        <View style={styles.heroMeta}>
          <StatusBadge label={`${course.credits} tín chỉ`} tone="primary" />
          {!!grade && (
            <StatusBadge
              label={`Điểm ${grade.total.toFixed(1)} · ${grade.letter}`}
              tone={grade.total >= 8 ? 'success' : 'warning'}
            />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Thông tin môn học" />
        <InfoRow label="Mã môn học" value={course.code} />
        <InfoRow label="Tên môn học" value={course.name} />
        <InfoRow label="Số tín chỉ" value={`${course.credits}`} />
        <InfoRow label="Giảng viên" value={orDash(course.lecturer)} />
        <InfoRow label="Học kỳ" value={course.semester} />
        <View style={styles.description}>
          <Text style={styles.descriptionLabel}>Mô tả</Text>
          <Text style={styles.descriptionText}>{course.description}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Lịch học trong tuần" />
        {courseSessions.length === 0 ? (
          <EmptyState title="Chưa có lịch học cho môn này" />
        ) : (
          courseSessions.map(session => (
            <View key={session.id}>
              <Text style={styles.weekdayLabel}>
                {getWeekdayLabel(session.weekday)}
              </Text>
              <SessionCard
                session={session}
                courseName={course.name}
                onPress={openSession}
              />
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Bài tập của môn học" />
        {courseAssignments.length === 0 ? (
          <EmptyState title="Môn học chưa có bài tập nào" />
        ) : (
          courseAssignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              courseName={course.name}
              onPress={openAssignment}
              onToggle={toggleAssignment}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 16,
  },
  code: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ccc',
  },
  name: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  card: {
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  description: {
    paddingTop: 12,
  },
  descriptionLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },
  section: {
    marginTop: 24,
  },
  weekdayLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 8,
  },
});

export default CourseDetailScreen;
