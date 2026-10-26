import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {Alert, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import CourseCard from '../../components/course/CourseCard';
import {useAppData} from '../../context/AppDataContext';
import {useSync} from '../../context/SyncContext';
import {HomeStackParamList, ROUTES} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {Assignment, Course} from '../../types';
import {daysLeft} from '../../utils/date';

type Navigation = NativeStackNavigationProp<HomeStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const {
    student,
    courses,
    assignments,
    loading,
    error,
    refreshing,
    lastUpdated,
    refreshStudent,
    refreshCourses,
    refreshAssignments,
    toggleAssignmentStatus,
  } = useAppData();
  const {pendingCount, pendingIds} = useSync();

  const upcoming = useMemo(
    () =>
      assignments
        .filter(item => {
          if (item.status === 'done') {
            return false;
          }
          const left = daysLeft(item.dueDate);
          return left >= 0 && left <= 7;
        })
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [assignments],
  );

  const stats = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const todo = assignments.filter(a => a.status === 'todo').length;
    return {totalCredits, todo};
  }, [courses, assignments]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshStudent(), refreshCourses(), refreshAssignments()]);
  }, [refreshStudent, refreshCourses, refreshAssignments]);

  const openCourse = useCallback(
    (course: Course) => {
      navigation.navigate(ROUTES.COURSE_DETAIL, {id: course.id});
    },
    [navigation],
  );

  const openAssignment = useCallback(
    (assignment: Assignment) => {
      navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, {id: assignment.id});
    },
    [navigation],
  );

  const handleToggle = useCallback(
    async (assignment: Assignment) => {
      try {
        await toggleAssignmentStatus(assignment);
      } catch {
        Alert.alert(
          'Khong cap nhat duoc',
          'Thao tac da duoc hoan tac. Vui long thu lai.',
        );
      }
    },
    [toggleAssignmentStatus],
  );

  const firstLoading =
    (loading.student || loading.courses || loading.assignments) &&
    !student &&
    courses.length === 0 &&
    assignments.length === 0;

  if (firstLoading) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai du lieu..." />
      </ScreenContainer>
    );
  }

  const fatalError = error.student ?? error.courses ?? error.assignments;
  if (fatalError && !student && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={fatalError.message} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  const isRefreshing =
    refreshing.student || refreshing.courses || refreshing.assignments;

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshAll} />
        }>
        <View style={styles.hero}>
          <Text style={styles.greeting}>Xin chao,</Text>
          <Text style={styles.name}>{student?.fullName ?? '--'}</Text>
          <Text style={styles.code}>
            {`${student?.studentCode ?? '--'} - ${student?.className ?? '--'}`}
          </Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{courses.length}</Text>
            <Text style={styles.statLabel}>Mon hoc</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalCredits}</Text>
            <Text style={styles.statLabel}>Tin chi</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.todo}</Text>
            <Text style={styles.statLabel}>Chua xong</Text>
          </View>
          <View style={styles.statCard}>
            <Text
              style={[
                styles.statValue,
                pendingCount > 0 && styles.statValueAlert,
              ]}>
              {pendingCount}
            </Text>
            <Text style={styles.statLabel}>Chua dong bo</Text>
          </View>
        </View>

        <LastUpdatedText timestamp={lastUpdated.assignments} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bai tap den han trong 7 ngay</Text>
          {upcoming.length === 0 ? (
            <EmptyState
              title="Khong co bai tap den han"
              description="Ban da hoan thanh cac bai tap sap toi han."
            />
          ) : (
            upcoming.map(item => (
              <AssignmentItem
                key={String(item.id)}
                assignment={item}
                pending={pendingIds.includes(String(item.id))}
                onPress={openAssignment}
                onToggleStatus={handleToggle}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon hoc dang hoc</Text>
          {courses.length === 0 ? (
            <EmptyState
              title="Chua co mon hoc"
              description="Danh sach mon hoc cua hoc ky nay dang trong."
            />
          ) : (
            courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={openCourse}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radius,
    padding: spacing.lg,
  },
  greeting: {
    ...typography.caption,
    color: colors.primarySoft,
  },
  name: {
    ...typography.h2,
    color: colors.white,
  },
  code: {
    ...typography.caption,
    color: colors.primarySoft,
    marginTop: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
  statValueAlert: {
    color: colors.warning,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
