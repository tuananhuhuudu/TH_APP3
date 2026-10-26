import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import FilterChips, {FilterOption} from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import {useAppData} from '../../context/AppDataContext';
import {ProfileStackParamList, ROUTES} from '../../navigation/routes';
import spacing from '../../theme/spacing';
import {Grade} from '../../types';
import {calcGpa} from '../../utils/gpa';

type Navigation = NativeStackNavigationProp<ProfileStackParamList>;

const ALL = 'all';

export default function GradeListScreen() {
  const navigation = useNavigation<Navigation>();
  const {grades, courses, loading, error, refreshing, lastUpdated, refreshGrades} =
    useAppData();

  const [semester, setSemester] = useState(ALL);

  const semesterOptions = useMemo<FilterOption[]>(() => {
    const unique = Array.from(new Set(grades.map(g => g.semester)));
    return [
      {value: ALL, label: 'Tat ca'},
      ...unique.map(s => ({value: s, label: s})),
    ];
  }, [grades]);

  const filtered = useMemo(
    () =>
      semester === ALL
        ? grades
        : grades.filter(g => g.semester === semester),
    [grades, semester],
  );

  const {gpa, totalCredits} = useMemo(
    () => calcGpa(filtered, courses),
    [filtered, courses],
  );

  const openDetail = useCallback(
    (grade: Grade) => {
      navigation.navigate(ROUTES.GRADE_DETAIL, {id: grade.id});
    },
    [navigation],
  );

  if (loading.grades && grades.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai ket qua hoc tap..." />
      </ScreenContainer>
    );
  }

  if (error.grades && grades.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.grades.message} onRetry={refreshGrades} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <GpaSummary gpa={gpa} totalCredits={totalCredits} />
        <FilterChips
          options={semesterOptions}
          selected={semester}
          onSelect={setSemester}
        />
        <LastUpdatedText timestamp={lastUpdated.grades} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <GradeRow grade={item} onPress={openDetail} />}
        contentContainerStyle={styles.list}
        refreshing={refreshing.grades}
        onRefresh={refreshGrades}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Chua co ket qua hoc tap"
            description={
              semester === ALL
                ? 'Chua co du lieu diem cho sinh vien nay.'
                : 'Hoc ky dang chon chua co du lieu diem.'
            }
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
