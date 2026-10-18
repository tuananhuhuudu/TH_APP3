import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ClassSession} from '../types';
import {colors} from '../utils/theme';
import StatusBadge from './StatusBadge';

type Props = {
  session: ClassSession;
  courseName: string;
  onPress: (session: ClassSession) => void;
};

function SessionCard({session, courseName, onPress}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => onPress(session)}>
      <View style={styles.timeColumn}>
        <Text style={styles.startTime}>{session.startTime}</Text>
        <View style={styles.timeLine} />
        <Text style={styles.endTime}>{session.endTime}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {courseName}
        </Text>
        {!!session.room && (
          <Text style={styles.room}>Phòng {session.room}</Text>
        )}
        <View style={styles.badgeRow}>
          <StatusBadge
            label={session.type}
            tone={session.type === 'Thực hành' ? 'warning' : 'primary'}
          />
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeColumn: {
    alignItems: 'center',
    marginRight: 16,
    paddingTop: 2,
  },
  startTime: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  timeLine: {
    width: 2,
    flex: 1,
    minHeight: 16,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  endTime: {
    fontSize: 13,
    color: colors.textMuted,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  room: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
  badgeRow: {
    marginTop: 8,
  },
  chevron: {
    fontSize: 28,
    color: colors.placeholder,
    marginLeft: 8,
    alignSelf: 'center',
  },
});

export default SessionCard;
