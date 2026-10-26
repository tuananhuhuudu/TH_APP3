import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as sessionService from '../../api/sessionService';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import InfoRow from '../../components/profile/InfoRow';
import {useAppData} from '../../context/AppDataContext';
import useCachedQuery from '../../hooks/useCachedQuery';
import {ROUTES, ScheduleStackParamList} from '../../navigation/routes';
import {detailKey} from '../../storage/keys';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {ClassSession} from '../../types';
import {getDayLabel} from '../../utils/date';

type Navigation = NativeStackNavigationProp<ScheduleStackParamList>;
type Route = RouteProp<ScheduleStackParamList, typeof ROUTES.SESSION_DETAIL>;

/** Khoang thoi gian cua buoi hoc, tinh theo phut. */
function getDuration(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if ([sh, sm, eh, em].some(Number.isNaN)) {
    return '--';
  }
  const minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes <= 0) {
    return '--';
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} gio ${rest} phut` : `${rest} phut`;
}

export default function SessionDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const {id} = useRoute<Route>().params;
  const {courses} = useAppData();

  const fetcher = useCallback(() => sessionService.getById(id), [id]);
  const {
    data: session,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useCachedQuery<ClassSession>(detailKey('sessions', id), fetcher);

  const course = useMemo(
    () => session?.course ?? courses.find(c => c.id === session?.courseId),
    [session, courses],
  );

  useEffect(() => {
    navigation.setOptions({title: course?.name ?? 'Chi tiet buoi hoc'});
  }, [navigation, course]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai chi tiet buoi hoc..." />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={refresh} />
      </ScreenContainer>
    );
  }

  if (!session) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Khong tim thay buoi hoc"
          description="Buoi hoc nay co the da bi xoa khoi he thong."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.day}>{getDayLabel(session.dayOfWeek)}</Text>
          <Text style={styles.time}>
            {`${session.startTime} - ${session.endTime}`}
          </Text>
          <Text style={styles.course}>{course?.name ?? 'Mon hoc khong xac dinh'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thong tin buoi hoc</Text>
          <InfoRow label="Mon hoc" value={course?.name ?? '--'} />
          <InfoRow label="Ma mon" value={course?.code ?? '--'} />
          <InfoRow label="Giang vien" value={course?.lecturer ?? '--'} />
          <InfoRow label="Thu" value={getDayLabel(session.dayOfWeek)} />
          <InfoRow
            label="Thoi gian"
            value={`${session.startTime} - ${session.endTime}`}
          />
          <InfoRow
            label="Thoi luong"
            value={getDuration(session.startTime, session.endTime)}
          />
          <InfoRow label="Phong hoc" value={session.room} />
          <InfoRow label="Ghi chu" value={session.note} />
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
    backgroundColor: colors.primary,
    borderRadius: spacing.radius,
    padding: spacing.lg,
  },
  day: {
    ...typography.captionBold,
    color: colors.primarySoft,
  },
  time: {
    ...typography.h1,
    color: colors.white,
    marginTop: spacing.xs,
  },
  course: {
    ...typography.body,
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
});
