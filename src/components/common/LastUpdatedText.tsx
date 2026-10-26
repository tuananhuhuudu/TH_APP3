/**
 * @param {string} [timestamp] - Chuoi ISO; khong hien khi rong
 */
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {formatDateTime} from '../../utils/date';

type Props = {
  timestamp?: string | null;
};

export default function LastUpdatedText({timestamp}: Props) {
  if (!timestamp) {
    return null;
  }

  const label = formatDateTime(timestamp);
  if (!label) {
    return null;
  }

  return <Text style={styles.text}>{`Cap nhat lan cuoi: ${label}`}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    paddingVertical: spacing.xs,
  },
});
