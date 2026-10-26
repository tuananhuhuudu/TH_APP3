import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import * as assignmentService from '../../api/assignmentService';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import SyncBadge from '../../components/common/SyncBadge';
import InfoRow from '../../components/profile/InfoRow';
import {useAppData} from '../../context/AppDataContext';
import {useSync} from '../../context/SyncContext';
import useCachedQuery from '../../hooks/useCachedQuery';
import {AssignmentStackParamList, ROUTES} from '../../navigation/routes';
import {detailKey} from '../../storage/keys';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {Assignment} from '../../types';
import {formatDate, getDueLabel, isOverdue} from '../../utils/date';

type Navigation = NativeStackNavigationProp<AssignmentStackParamList>;
type Route = RouteProp<
  AssignmentStackParamList,
  typeof ROUTES.ASSIGNMENT_DETAIL
>;

export default function AssignmentDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const {id} = useRoute<Route>().params;
  const {assignments, courses, toggleAssignmentStatus} = useAppData();
  const {pendingIds} = useSync();

  const fetcher = useCallback(() => assignmentService.getById(id), [id]);
  const {
    data: fetched,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useCachedQuery<Assignment>(detailKey('assignments', id), fetcher);

  const fromContext = useMemo(
    () => assignments.find(a => String(a.id) === String(id)),
    [assignments, id],
  );

  /**
   * Uu tien ban trong context vi no mang thay doi lac quan va thao tac offline
   * chua dong bo; ban goi tu API dung lam du lieu nen.
   */
  const assignment = fromContext ?? fetched;

  const course = useMemo(
    () =>
      assignment?.course ?? courses.find(c => c.id === assignment?.courseId),
    [assignment, courses],
  );

  useEffect(() => {
    navigation.setOptions({title: assignment?.title ?? 'Chi tiet bai tap'});
  }, [navigation, assignment]);

  if (loading && !assignment) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai chi tiet bai tap..." />
      </ScreenContainer>
    );
  }

  if (error && !assignment) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={refresh} />
      </ScreenContainer>
    );
  }

  if (!assignment) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Khong tim thay bai tap"
          description="Bai tap nay co the da bi xoa khoi he thong."
        />
      </ScreenContainer>
    );
  }

  const done = assignment.status === 'done';
  const overdue = !done && isOverdue(assignment.dueDate);

  async function handleToggle() {
    if (!assignment) {
      return;
    }
    try {
      await toggleAssignmentStatus(assignment);
    } catch {
      Alert.alert(
        'Khong cap nhat duoc',
        'Thao tac da duoc hoan tac. Vui long thu lai.',
      );
    }
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View
          style={[
            styles.hero,
            done && styles.heroDone,
            overdue && styles.heroOverdue,
          ]}>
          <Text style={styles.courseLabel}>
            {course?.name ?? 'Mon hoc khong xac dinh'}
          </Text>
          <Text style={styles.title}>{assignment.title}</Text>
          <Text style={styles.due}>{getDueLabel(assignment.dueDate)}</Text>
          <SyncBadge pending={pendingIds.includes(String(assignment.id))} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thong tin bai tap</Text>
          <InfoRow label="Mon hoc" value={course?.name ?? '--'} />
          <InfoRow label="Ma mon" value={course?.code ?? '--'} />
          <InfoRow label="Giang vien" value={course?.lecturer ?? '--'} />
          <InfoRow label="Han nop" value={formatDate(assignment.dueDate)} />
          <InfoRow
            label="Trang thai"
            value={done ? 'Da hoan thanh' : 'Chua hoan thanh'}
          />
          <View style={styles.description}>
            <Text style={styles.descriptionLabel}>Yeu cau</Text>
            <Text style={styles.descriptionText}>{assignment.description}</Text>
          </View>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>

        <AppButton
          title={done ? 'Danh dau chua hoan thanh' : 'Danh dau da hoan thanh'}
          variant={done ? 'outline' : 'primary'}
          onPress={handleToggle}
          style={styles.button}
        />
      </View>
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
    gap: spacing.xs,
  },
  heroDone: {
    backgroundColor: colors.success,
  },
  heroOverdue: {
    backgroundColor: colors.danger,
  },
  courseLabel: {
    ...typography.captionBold,
    color: colors.white,
    opacity: 0.9,
  },
  title: {
    ...typography.h2,
    color: colors.white,
  },
  due: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.9,
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
    marginBottom: spacing.sm,
  },
  description: {
    paddingTop: spacing.md,
  },
  descriptionLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  descriptionText: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  button: {
    marginTop: spacing.lg,
  },
});
