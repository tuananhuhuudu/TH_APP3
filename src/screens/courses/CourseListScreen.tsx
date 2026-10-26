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
import SearchBar from '../../components/common/SearchBar';
import CourseCard from '../../components/course/CourseCard';
import {useAppData} from '../../context/AppDataContext';
import {CourseStackParamList, ROUTES} from '../../navigation/routes';
import spacing from '../../theme/spacing';
import {Course} from '../../types';

type Navigation = NativeStackNavigationProp<CourseStackParamList>;

const ALL = 'all';

export default function CourseListScreen() {
  const navigation = useNavigation<Navigation>();
  const {courses, loading, error, refreshing, lastUpdated, refreshCourses} =
    useAppData();

  const [keyword, setKeyword] = useState('');
  const [semester, setSemester] = useState(ALL);

  const semesterOptions = useMemo<FilterOption[]>(() => {
    const unique = Array.from(new Set(courses.map(c => c.semester)));
    return [
      {value: ALL, label: 'Tat ca'},
      ...unique.map(s => ({value: s, label: s})),
    ];
  }, [courses]);

  const filtered = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return courses.filter(course => {
      if (semester !== ALL && course.semester !== semester) {
        return false;
      }
      if (!text) {
        return true;
      }
      return (
        course.name.toLowerCase().includes(text) ||
        course.code.toLowerCase().includes(text)
      );
    });
  }, [courses, keyword, semester]);

  const openCourse = useCallback(
    (course: Course) => {
      navigation.navigate(ROUTES.COURSE_DETAIL, {id: course.id});
    },
    [navigation],
  );

  if (loading.courses && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai danh sach mon hoc..." />
      </ScreenContainer>
    );
  }

  if (error.courses && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.courses.message} onRetry={refreshCourses} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Tim theo ten hoac ma mon..."
        />
        <FilterChips
          options={semesterOptions}
          selected={semester}
          onSelect={setSemester}
        />
        <LastUpdatedText timestamp={lastUpdated.courses} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <CourseCard course={item} onPress={openCourse} />
        )}
        contentContainerStyle={styles.list}
        refreshing={refreshing.courses}
        onRefresh={refreshCourses}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Khong co mon hoc nao"
            description={
              keyword || semester !== ALL
                ? 'Khong tim thay mon hoc phu hop voi dieu kien loc.'
                : 'Danh sach mon hoc dang trong.'
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
    gap: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
