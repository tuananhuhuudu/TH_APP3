import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../utils/theme';

type Props = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

function SectionHeader({title, actionLabel, onPressAction}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!!actionLabel && (
        <TouchableOpacity onPress={onPressAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default SectionHeader;
