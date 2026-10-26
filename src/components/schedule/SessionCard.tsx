/**
 * @param {ClassSession} session - Bat buoc
 * @param {(session: ClassSession) => void} onPress - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {ClassSession} from '../../types';

type Props = {
  session: ClassSession;
  onPress: (session: ClassSession) => void;
};

function SessionCard({session, onPress}: Props) {
  const courseName = session.course?.name ?? 'Mon hoc khong xac dinh';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(session)}
      accessibilityRole="button"
      accessibilityLabel={`Buoi hoc ${courseName}`}
      style={styles.card}>
      <View style={styles.timeBox}>
        <Text style={styles.timeStart}>{session.startTime}</Text>
        <Text style={styles.timeEnd}>{session.endTime}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {courseName}
        </Text>
        <Text style={styles.room}>{session.room || 'Chua co phong'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(SessionCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  timeBox: {
    width: 56,
    marginRight: spacing.md,
  },
  timeStart: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  timeEnd: {
    ...typography.caption,
    color: colors.textMuted,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
  },
  room: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
