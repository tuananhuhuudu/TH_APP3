import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as gradeService from '../../api/gradeService';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import {useAppData} from '../../context/AppDataContext';
import useCachedQuery from '../../hooks/useCachedQuery';
import {ProfileStackParamList, ROUTES} from '../../navigation/routes';
import {detailKey} from '../../storage/keys';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {Grade} from '../../types';
import {toScale4} from '../../utils/gpa';

type Navigation = NativeStackNavigationProp<ProfileStackParamList>;
type Route = RouteProp<ProfileStackParamList, typeof ROUTES.GRADE_DETAIL>;

/** Thanh bieu dien diem tren thang 10. */
function ScoreBar({label, score}: {label: string; score: number}) {
  const percent = Math.max(0, Math.min(100, (score / 10) * 100));
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, {width: `${percent}%`}]} />
      </View>
      <Text style={styles.barValue}>{score.toFixed(1)}</Text>
    </View>
  );
}

export default function GradeDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const {id} = useRoute<Route>().params;
  const {courses} = useAppData();

  const fetcher = useCallback(() => gradeService.getById(id), [id]);
  const {
    data: grade,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useCachedQuery<Grade>(detailKey('grades', id), fetcher);

  const course = useMemo(
    () => grade?.course ?? courses.find(c => c.id === grade?.courseId),
    [grade, courses],
  );

  useEffect(() => {
    navigation.setOptions({title: course?.name ?? 'Chi tiet ket qua'});
  }, [navigation, course]);

  if (loading && !grade) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai chi tiet ket qua..." />
      </ScreenContainer>
    );
  }

  if (error && !grade) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={refresh} />
      </ScreenContainer>
    );
  }

  if (!grade) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Khong tim thay ket qua"
          description="Ket qua nay co the da bi xoa khoi he thong."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.courseName}>{course?.name ?? '--'}</Text>
          <Text style={styles.total}>{grade.total.toFixed(2)}</Text>
          <Text style={styles.letter}>
            {`Diem chu ${grade.letter} - He 4: ${toScale4(grade.total).toFixed(
              1,
            )}`}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Diem thanh phan</Text>
          <ScoreBar label="Chuyen can" score={grade.attendance} />
          <ScoreBar label="Giua ky" score={grade.midterm} />
          <ScoreBar label="Cuoi ky" score={grade.final} />
          <Text style={styles.formula}>
            Tong ket = 10% chuyen can + 30% giua ky + 60% cuoi ky
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thong tin mon hoc</Text>
          <InfoRow label="Mon hoc" value={course?.name ?? '--'} />
          <InfoRow label="Ma mon" value={course?.code ?? '--'} />
          <InfoRow
            label="So tin chi"
            value={course ? `${course.credits}` : '--'}
          />
          <InfoRow label="Hoc ky" value={grade.semester} />
          <InfoRow label="Diem tong ket" value={grade.total.toFixed(2)} />
          <InfoRow label="Diem chu" value={grade.letter} />
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.radius,
    padding: spacing.xl,
  },
  courseName: {
    ...typography.captionBold,
    color: colors.primarySoft,
    textAlign: 'center',
  },
  total: {
    ...typography.h1,
    fontSize: 40,
    color: colors.white,
    marginTop: spacing.sm,
  },
  letter: {
    ...typography.caption,
    color: colors.primarySoft,
    marginTop: spacing.xs,
  },
  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textMuted,
    width: 80,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  barValue: {
    ...typography.captionBold,
    color: colors.text,
    width: 32,
    textAlign: 'right',
  },
  formula: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
