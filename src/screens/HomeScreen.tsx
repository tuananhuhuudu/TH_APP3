import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AssignmentCard from '../components/AssignmentCard';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import {useApp} from '../data/AppContext';
import {RootStackParamList} from '../navigation/types';
import {Assignment, Course} from '../types';
import {calculateGPA, daysUntil, getCourseName} from '../utils/helpers';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const {courses, assignments, grades, profile, loading, toggleAssignment} =
    useApp();

  // Bài tập chưa nộp, sắp xếp theo hạn gần nhất.
  const upcoming = useMemo(
    () =>
      assignments
        .filter(item => !item.done)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 3),
    [assignments],
  );

  const stats = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const pending = assignments.filter(item => !item.done).length;
    const overdue = assignments.filter(
      item => !item.done && daysUntil(item.dueDate) < 0,
    ).length;
    return {
      totalCredits,
      pending,
      overdue,
      gpa: calculateGPA(grades, courses),
    };
  }, [courses, assignments, grades]);

  function openCourse(course: Course) {
    navigation.navigate('CourseDetail', {course});
  }

  function openAssignment(assignment: Assignment) {
    navigation.navigate('AssignmentDetail', {assignment});
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.fullName.trim().split(' ').slice(-1)[0]?.[0] ?? '?'}
          </Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.studentId}>
            {profile.studentId} · {profile.className}
          </Text>
        </View>
      </View>

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{courses.length}</Text>
          <Text style={styles.statLabel}>Môn học</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCredits}</Text>
          <Text style={styles.statLabel}>Tín chỉ</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[
              styles.statValue,
              stats.overdue > 0 && styles.statValueAlert,
            ]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Bài chưa nộp</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.gpa.toFixed(2)}</Text>
          <Text style={styles.statLabel}>GPA</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Bài tập sắp đến hạn"
          actionLabel="Xem tất cả"
          onPressAction={() =>
            navigation.navigate('MainTabs', {screen: 'Assignments'})
          }
        />
        {upcoming.length === 0 ? (
          <EmptyState
            title="Không có bài tập nào đến hạn"
            description="Bạn đã hoàn thành tất cả bài tập được giao."
          />
        ) : (
          upcoming.map(item => (
            <AssignmentCard
              key={item.id}
              assignment={item}
              courseName={getCourseName(courses, item.courseId)}
              onPress={openAssignment}
              onToggle={toggleAssignment}
            />
          ))
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Môn học đang học"
          actionLabel="Xem tất cả"
          onPressAction={() =>
            navigation.navigate('MainTabs', {screen: 'Courses'})
          }
        />
        {courses.length === 0 ? (
          <EmptyState
            title="Chưa có môn học"
            description="Danh sách môn học của học kỳ này đang trống."
          />
        ) : (
          courses
            .slice(0, 3)
            .map(course => (
              <CourseCard key={course.id} course={course} onPress={openCourse} />
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textMuted,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  heroText: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  studentId: {
    marginTop: 2,
    fontSize: 13,
    color: '#ccc',
  },
  statRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statValueAlert: {
    color: colors.danger,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
});

export default HomeScreen;
