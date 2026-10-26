/**
 * @param {string} message - Bat buoc
 * @param {() => void} onRetry - Bat buoc
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppButton from './AppButton';

type Props = {
  message: string;
  onRetry: () => void;
};

export default function ErrorView({message, onRetry}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>
      <Text style={styles.title}>Khong tai duoc du lieu</Text>
      <Text style={styles.message}>{message}</Text>
      <AppButton title="Thu lai" variant="outline" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconText: {
    ...typography.h2,
    color: colors.danger,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
});
