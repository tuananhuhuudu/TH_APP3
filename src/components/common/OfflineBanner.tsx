/** Khong co props. Doc trang thai mang truc tiep tu hook. */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Day la ngoai le duy nhat duoc dung hook trong thu muc components,
 * vi banner phai tu biet trang thai mang o moi man hinh.
 */
export default function OfflineBanner() {
  const {isOnline} = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.container} accessibilityLabel="Dang o che do offline">
      <Text style={styles.text}>Ban dang offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warningSoft,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  text: {
    ...typography.captionBold,
    color: colors.warning,
    textAlign: 'center',
  },
});
