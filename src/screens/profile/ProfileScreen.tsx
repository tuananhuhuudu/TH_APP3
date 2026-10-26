import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppButton from '../../components/common/AppButton';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import SyncBadge from '../../components/common/SyncBadge';
import GpaSummary from '../../components/grade/GpaSummary';
import InfoRow from '../../components/profile/InfoRow';
import {useAppData} from '../../context/AppDataContext';
import {useSync} from '../../context/SyncContext';
import {ProfileStackParamList, ROUTES} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {calcGpa, getClassification} from '../../utils/gpa';

type Navigation = NativeStackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Navigation>();
  const {student, grades, courses, loading, error, lastUpdated, refreshStudent} =
    useAppData();
  const {pendingCount} = useSync();

  const {gpa, totalCredits} = useMemo(
    () => calcGpa(grades, courses),
    [grades, courses],
  );

  if (loading.student && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai thong tin ca nhan..." />
      </ScreenContainer>
    );
  }

  if (error.student && !student) {
    return (
      <ScreenContainer>
        <ErrorView message={error.student.message} onRetry={refreshStudent} />
      </ScreenContainer>
    );
  }

  const initial = student?.fullName?.trim().split(' ').slice(-1)[0]?.[0] ?? '?';

  return (
    <ScreenContainer scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{student?.fullName ?? '--'}</Text>
          <Text style={styles.code}>{student?.studentCode ?? '--'}</Text>
          <SyncBadge pending={pendingCount > 0} />
        </View>

        <View style={styles.gpaWrap}>
          <GpaSummary gpa={gpa} totalCredits={totalCredits} />
          <Text style={styles.classification}>
            {`Xep loai: ${getClassification(gpa)}`}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thong tin sinh vien</Text>
          <InfoRow label="Ma sinh vien" value={student?.studentCode ?? ''} />
          <InfoRow label="Ho va ten" value={student?.fullName ?? ''} />
          <InfoRow label="Lop" value={student?.className ?? ''} />
          <InfoRow label="Nganh hoc" value={student?.major ?? ''} />
          <InfoRow label="Email" value={student?.email ?? ''} />
          <InfoRow label="So dien thoai" value={student?.phone ?? ''} />
          <LastUpdatedText timestamp={lastUpdated.student} />
        </View>

        <AppButton
          title="Chinh sua thong tin"
          onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          style={styles.button}
        />
        <AppButton
          title="Xem ket qua hoc tap"
          variant="outline"
          onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.radius,
    padding: spacing.xl,
    gap: spacing.xs,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h1,
    color: colors.white,
  },
  name: {
    ...typography.h2,
    color: colors.white,
    marginTop: spacing.sm,
  },
  code: {
    ...typography.caption,
    color: colors.primarySoft,
  },
  gpaWrap: {
    marginTop: spacing.lg,
  },
  classification: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
  },
});
