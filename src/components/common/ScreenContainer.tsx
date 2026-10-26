/**
 * @param {React.ReactNode} children - Bat buoc
 * @param {boolean} [scroll] - Cho phep cuon noi dung, mac dinh false
 */
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import OfflineBanner from './OfflineBanner';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
};

/** Moi man hinh deu boc bang component nay de co nen va banner offline. */
export default function ScreenContainer({children, scroll = false}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
