import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import InfoRow from '../components/InfoRow';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import {useApp} from '../data/AppContext';
import {RootStackParamList} from '../navigation/types';
import {findCourse, getClassification, orDash} from '../utils/helpers';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'GradeDetail'>;

type ScoreBarProps = {
  label: string;
  score: number;
  weight: string;
};

/** Thanh biểu diễn điểm trên thang 10. */
function ScoreBar({label, score, weight}: ScoreBarProps) {
  return (
    <View style={styles.scoreBlock}>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreLabel}>
          {label} ({weight})
        </Text>
        <Text style={styles.scoreValue}>{score.toFixed(1)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, {width: `${(score / 10) * 100}%`}]} />
      </View>
    </View>
  );
}

function GradeDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const {grade} = useRoute<Route>().params;
  const insets = useSafeAreaInsets();
  const {courses} = useApp();

  const course = findCourse(courses, grade.courseId);
  const passed = grade.total >= 4;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {paddingBottom: insets.bottom + 24},
      ]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.courseLabel}>
          {course?.name ?? 'Môn học không xác định'}
        </Text>
        <Text style={styles.total}>{grade.total.toFixed(1)}</Text>
        <Text style={styles.totalLabel}>Điểm tổng kết (thang 10)</Text>
        <View style={styles.heroMeta}>
          <StatusBadge label={`Điểm chữ ${grade.letter}`} tone="primary" />
          <StatusBadge
            label={passed ? 'Đạt' : 'Không đạt'}
            tone={passed ? 'success' : 'danger'}
          />
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Chi tiết điểm thành phần" />
        <ScoreBar label="Điểm giữa kỳ" score={grade.midterm} weight="40%" />
        <ScoreBar label="Điểm cuối kỳ" score={grade.final} weight="60%" />
        <ScoreBar label="Điểm tổng kết" score={grade.total} weight="100%" />
      </View>

      <View style={styles.card}>
        <SectionHeader title="Thông tin môn học" />
        <InfoRow label="Môn học" value={course?.name ?? 'Không xác định'} />
        <InfoRow label="Mã môn học" value={course?.code ?? '--'} />
        <InfoRow label="Số tín chỉ" value={`${course?.credits ?? '--'}`} />
        <InfoRow label="Giảng viên" value={orDash(course?.lecturer)} />
        <InfoRow label="Học kỳ" value={course?.semester ?? '--'} />
        <InfoRow label="Xếp loại" value={getClassification(grade.total)} />
      </View>

      {!!course && (
        <AppButton
          title="Xem chi tiết môn học"
          variant="outline"
          style={styles.button}
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
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 24,
  },
  courseLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    textAlign: 'center',
  },
  total: {
    marginTop: 8,
    fontSize: 44,
    fontWeight: '700',
    color: '#fff',
  },
  totalLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  card: {
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreBlock: {
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  button: {
    marginTop: 16,
  },
});

export default GradeDetailScreen;
