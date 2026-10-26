/**
 * @param {boolean} pending - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

type Props = {
  pending: boolean;
};

export default function SyncBadge({pending}: Props) {
  if (!pending) {
    return null;
  }

  return (
    <View style={styles.badge} accessibilityLabel="Thay doi chua dong bo">
      <Text style={styles.text}>Chua dong bo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: {
    ...typography.small,
    color: colors.warning,
  },
});
