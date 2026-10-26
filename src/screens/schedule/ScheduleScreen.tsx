import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import {useAppData} from '../../context/AppDataContext';
import {ROUTES, ScheduleStackParamList} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {ClassSession} from '../../types';
import {getDayLabel, getTodayDayOfWeek} from '../../utils/date';

type Navigation = NativeStackNavigationProp<ScheduleStackParamList>;

export default function ScheduleScreen() {
  const navigation = useNavigation<Navigation>();
  const {sessions, loading, error, refreshing, lastUpdated, refreshSessions} =
    useAppData();

  const [selectedDay, setSelectedDay] = useState(getTodayDayOfWeek);

  const sessionsOfDay = useMemo(
    () =>
      sessions
        .filter(session => session.dayOfWeek === selectedDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [sessions, selectedDay],
  );

  const openSession = useCallback(
    (session: ClassSession) => {
      navigation.navigate(ROUTES.SESSION_DETAIL, {id: session.id});
    },
    [navigation],
  );

  if (loading.sessions && sessions.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai thoi khoa bieu..." />
      </ScreenContainer>
    );
  }

  if (error.sessions && sessions.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.sessions.message} onRetry={refreshSessions} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>{getDayLabel(selectedDay)}</Text>
          <Text style={styles.summaryText}>
            {sessionsOfDay.length === 0
              ? 'Khong co buoi hoc'
              : `${sessionsOfDay.length} buoi hoc`}
          </Text>
        </View>
        <LastUpdatedText timestamp={lastUpdated.sessions} />
      </View>

      <FlatList
        data={sessionsOfDay}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <SessionCard session={item} onPress={openSession} />
        )}
        contentContainerStyle={styles.list}
        refreshing={refreshing.sessions}
        onRefresh={refreshSessions}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Ngay nay khong co lich hoc"
            description="Ban co the danh thoi gian de on tap hoac lam bai tap."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.text,
  },
  summaryText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
