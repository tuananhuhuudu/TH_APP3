import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import {useApp} from '../data/AppContext';
import {RootStackParamList} from '../navigation/types';
import {Course} from '../types';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

function CoursesScreen() {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const {courses} = useApp();
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    if (!text) {
      return courses;
    }
    return courses.filter(
      course =>
        course.name.toLowerCase().includes(text) ||
        course.code.toLowerCase().includes(text),
    );
  }, [courses, keyword]);

  const totalCredits = useMemo(
    () => filtered.reduce((sum, course) => sum + course.credits, 0),
    [filtered],
  );

  function openCourse(course: Course) {
    navigation.navigate('CourseDetail', {course});
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Tìm theo tên hoặc mã môn học..."
        />
        <Text style={styles.summary}>
          {filtered.length} môn học · {totalCredits} tín chỉ
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <CourseCard course={item} onPress={openCourse} />
        )}
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: insets.bottom + 16},
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            description={
              keyword
                ? `Không có môn học nào khớp với "${keyword}".`
                : 'Danh sách môn học đang trống.'
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  summary: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textMuted,
  },
  listContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
});

export default CoursesScreen;
