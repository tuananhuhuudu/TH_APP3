import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../utils/theme';

type Props = {
  label: string;
  value: string;
};

function InfoRow({label, value}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    width: 120,
    fontSize: 14,
    color: colors.textMuted,
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

export default InfoRow;
