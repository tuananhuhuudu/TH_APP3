import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import SessionCard from '../components/SessionCard';
import {useApp} from '../data/AppContext';
import {RootStackParamList} from '../navigation/types';
import {ClassSession} from '../types';
import {WEEKDAYS, getCourseName, getWeekdayLabel} from '../utils/helpers';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

/** Trả về giá trị weekday (2..8) tương ứng ngày hôm nay. */
function getCurrentWeekday(): number {
  const day = new Date().getDay(); // 0 = Chủ nhật
  return day === 0 ? 8 : day + 1;
}

function ScheduleScreen() {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const {sessions, courses} = useApp();
  const [selectedDay, setSelectedDay] = useState(getCurrentWeekday);

  const sessionsOfDay = useMemo(
    () =>
      sessions
        .filter(session => session.weekday === selectedDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [sessions, selectedDay],
  );

  // Số buổi học mỗi ngày để hiển thị chấm báo trên thanh chọn thứ.
  const countByDay = useMemo(() => {
    return sessions.reduce<Record<number, number>>((acc, session) => {
      acc[session.weekday] = (acc[session.weekday] ?? 0) + 1;
      return acc;
    }, {});
  }, [sessions]);

  function openSession(session: ClassSession) {
    navigation.navigate('SessionDetail', {session});
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dayBarWrap}
        contentContainerStyle={styles.dayBar}>
        {WEEKDAYS.map(day => {
          const active = day.value === selectedDay;
          return (
            <TouchableOpacity
              key={day.value}
              activeOpacity={0.8}
              style={[styles.dayChip, active && styles.dayChipActive]}
              onPress={() => setSelectedDay(day.value)}>
              <Text style={[styles.dayText, active && styles.dayTextActive]}>
                {day.label}
              </Text>
              {!!countByDay[day.value] && (
                <View style={[styles.dot, active && styles.dotActive]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>{getWeekdayLabel(selectedDay)}</Text>
        <Text style={styles.summaryText}>
          {sessionsOfDay.length === 0
            ? 'Không có buổi học'
            : `${sessionsOfDay.length} buổi học`}
        </Text>
      </View>

      <FlatList
        data={sessionsOfDay}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <SessionCard
            session={item}
            courseName={getCourseName(courses, item.courseId)}
            onPress={openSession}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: insets.bottom + 16},
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Ngày này không có lịch học"
            description="Bạn có thể dành thời gian để ôn tập hoặc làm bài tập."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Không giới hạn thì ScrollView ngang giãn hết chiều cao còn trống,
  // kéo các chip chọn thứ cao theo.
  dayBarWrap: {
    flexGrow: 0,
  },
  dayBar: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
    alignItems: 'center',
  },
  dayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dayTextActive: {
    color: '#fff',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  listContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
});

export default ScheduleScreen;
