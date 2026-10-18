import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import InfoRow from '../components/InfoRow';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import {useApp} from '../data/AppContext';
import {RootStackParamList} from '../navigation/types';
import {
  daysUntil,
  findCourse,
  formatDate,
  getDueLabel,
  orDash,
} from '../utils/helpers';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'AssignmentDetail'>;

function AssignmentDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const {assignment: initial} = useRoute<Route>().params;
  const insets = useSafeAreaInsets();
  const {assignments, courses, toggleAssignment} = useApp();

  // Lấy bản mới nhất từ context để trạng thái cập nhật ngay trên màn hình này.
  const assignment = useMemo(
    () => assignments.find(item => item.id === initial.id) ?? initial,
    [assignments, initial],
  );

  const course = findCourse(courses, assignment.courseId);
  const remaining = daysUntil(assignment.dueDate);
  const overdue = !assignment.done && remaining < 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {paddingBottom: insets.bottom + 24},
      ]}
      showsVerticalScrollIndicator={false}>
      <View
        style={[
          styles.hero,
          assignment.done && styles.heroDone,
          overdue && styles.heroOverdue,
        ]}>
        <Text style={styles.courseLabel}>
          {course?.name ?? 'Môn học không xác định'}
        </Text>
        <Text style={styles.title}>{assignment.title}</Text>
        <View style={styles.heroMeta}>
          <StatusBadge
            label={assignment.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            tone={assignment.done ? 'success' : overdue ? 'danger' : 'warning'}
          />
          <StatusBadge label={getDueLabel(assignment)} tone="primary" />
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Thông tin bài tập" />
        <InfoRow label="Tên bài tập" value={assignment.title} />
        <InfoRow label="Môn học" value={course?.name ?? 'Không xác định'} />
        <InfoRow label="Mã môn học" value={course?.code ?? '--'} />
        <InfoRow label="Giảng viên" value={orDash(course?.lecturer)} />
        <InfoRow label="Hạn nộp" value={formatDate(assignment.dueDate)} />
        <InfoRow
          label="Trạng thái"
          value={assignment.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        />
        <View style={styles.description}>
          <Text style={styles.descriptionLabel}>Yêu cầu</Text>
          <Text style={styles.descriptionText}>{assignment.description}</Text>
        </View>
      </View>

      <AppButton
        title={
          assignment.done
            ? 'Đánh dấu chưa hoàn thành'
            : 'Đánh dấu đã hoàn thành'
        }
        variant={assignment.done ? 'outline' : 'success'}
        style={styles.button}
        onPress={() => toggleAssignment(assignment.id)}
      />

      {!!course && (
        <AppButton
          title="Xem chi tiết môn học"
          variant="outline"
          style={styles.buttonSpacing}
          onPress={() => navigation.navigate('CourseDetail', {course})}
        />
      )}
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
    backgroundColor: colors.warning,
    borderRadius: 6,
    padding: 16,
  },
  heroDone: {
    backgroundColor: colors.success,
  },
  heroOverdue: {
    backgroundColor: colors.danger,
  },
  courseLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    opacity: 0.85,
  },
  title: {
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
  button: {
    marginTop: 16,
  },
  buttonSpacing: {
    marginTop: 12,
  },
});

export default AssignmentDetailScreen;
