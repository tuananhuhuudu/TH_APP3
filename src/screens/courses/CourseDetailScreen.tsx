import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as courseService from '../../api/courseService';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import {useAppData} from '../../context/AppDataContext';
import useCachedQuery from '../../hooks/useCachedQuery';
import {CourseStackParamList, ROUTES} from '../../navigation/routes';
import {detailKey} from '../../storage/keys';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {Course} from '../../types';
import {formatDate, getDayLabel} from '../../utils/date';

type Navigation = NativeStackNavigationProp<CourseStackParamList>;
type Route = RouteProp<CourseStackParamList, typeof ROUTES.COURSE_DETAIL>;

export default function CourseDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const {id} = useRoute<Route>().params;
  const {sessions, assignments} = useAppData();

  const fetcher = useCallback(() => courseService.getById(id), [id]);
  const {
    data: course,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useCachedQuery<Course>(detailKey('courses', id), fetcher);

  const courseSessions = useMemo(
    () => sessions.filter(s => s.courseId === id),
    [sessions, id],
  );

  const courseAssignments = useMemo(
    () => assignments.filter(a => a.courseId === id),
    [assignments, id],
  );

  useEffect(() => {
    navigation.setOptions({title: course?.name ?? 'Chi tiet mon hoc'});
  }, [navigation, course]);

  if (loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai chi tiet mon hoc..." />
      </ScreenContainer>
    );
  }

  if (error && !course) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={refresh} />
      </ScreenContainer>
    );
  }

  if (!course) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Khong tim thay mon hoc"
          description="Mon hoc nay co the da bi xoa khoi he thong."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.code}>{course.code}</Text>
          <Text style={styles.name}>{course.name}</Text>
          <Text style={styles.semester}>{course.semester}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thong tin mon hoc</Text>
          <InfoRow label="Ma mon" value={course.code} />
          <InfoRow label="So tin chi" value={`${course.credits}`} />
          <InfoRow label="Giang vien" value={course.lecturer} />
          <InfoRow label="Hoc ky" value={course.semester} />
          <View style={styles.description}>
            <Text style={styles.descriptionLabel}>Mo ta</Text>
            <Text style={styles.descriptionText}>{course.description}</Text>
          </View>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lich hoc</Text>
          {courseSessions.length === 0 ? (
            <Text style={styles.muted}>Chua co lich hoc cho mon nay.</Text>
          ) : (
            courseSessions.map(session => (
              <InfoRow
                key={session.id}
                label={getDayLabel(session.dayOfWeek)}
                value={`${session.startTime} - ${session.endTime} | ${
                  session.room || 'Chua co phong'
                }`}
              />
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bai tap cua mon</Text>
          {courseAssignments.length === 0 ? (
            <Text style={styles.muted}>Chua co bai tap nao.</Text>
          ) : (
            courseAssignments.map(item => (
              <InfoRow
                key={String(item.id)}
                label={item.status === 'done' ? 'Da xong' : 'Chua xong'}
                value={`${item.title} (han ${formatDate(item.dueDate)})`}
              />
            ))
          )}
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
    backgroundColor: colors.primary,
    borderRadius: spacing.radius,
    padding: spacing.lg,
  },
  code: {
    ...typography.captionBold,
    color: colors.primarySoft,
  },
  name: {
    ...typography.h2,
    color: colors.white,
    marginTop: spacing.xs,
  },
  semester: {
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
  muted: {
    ...typography.body,
    color: colors.textMuted,
  },
});
