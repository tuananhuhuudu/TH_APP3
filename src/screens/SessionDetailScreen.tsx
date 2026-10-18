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
import {findCourse, getWeekdayLabel, orDash} from '../utils/helpers';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'SessionDetail'>;

/** Khoảng thời gian của buổi học, tính theo phút. */
function getDurationLabel(start: string, end: string): string {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  const hours = Math.floor(minutes / 60);
  const remain = minutes % 60;
  return remain === 0 ? `${hours} giờ` : `${hours} giờ ${remain} phút`;
}

function SessionDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const {session} = useRoute<Route>().params;
  const insets = useSafeAreaInsets();
  const {courses} = useApp();

  const course = findCourse(courses, session.courseId);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {paddingBottom: insets.bottom + 24},
      ]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.weekday}>{getWeekdayLabel(session.weekday)}</Text>
        <Text style={styles.time}>
          {session.startTime} - {session.endTime}
        </Text>
        <Text style={styles.courseName}>
          {course?.name ?? 'Môn học không xác định'}
        </Text>
        <View style={styles.heroMeta}>
          <StatusBadge
            label={session.type}
            tone={session.type === 'Thực hành' ? 'warning' : 'primary'}
          />
          {!!session.room && (
            <StatusBadge label={`Phòng ${session.room}`} tone="primary" />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Thông tin buổi học" />
        <InfoRow label="Môn học" value={course?.name ?? 'Không xác định'} />
        <InfoRow label="Mã môn học" value={course?.code ?? '--'} />
        <InfoRow label="Giảng viên" value={orDash(course?.lecturer)} />
        <InfoRow label="Thứ" value={getWeekdayLabel(session.weekday)} />
        <InfoRow
          label="Thời gian"
          value={`${session.startTime} - ${session.endTime}`}
        />
        <InfoRow
          label="Thời lượng"
          value={getDurationLabel(session.startTime, session.endTime)}
        />
        <InfoRow label="Phòng học" value={orDash(session.room)} />
        <InfoRow label="Hình thức" value={session.type} />
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
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 16,
  },
  weekday: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ccc',
  },
  time: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  courseName: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
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
  button: {
    marginTop: 16,
  },
});

export default SessionDetailScreen;
