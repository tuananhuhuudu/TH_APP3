import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AssignmentCard from '../components/AssignmentCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import {useApp} from '../data/AppContext';
import {RootStackParamList} from '../navigation/types';
import {Assignment} from '../types';
import {getCourseName} from '../utils/helpers';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Filter = 'all' | 'pending' | 'done';

const FILTERS: {value: Filter; label: string}[] = [
  {value: 'all', label: 'Tất cả'},
  {value: 'pending', label: 'Chưa hoàn thành'},
  {value: 'done', label: 'Đã hoàn thành'},
];

function AssignmentsScreen() {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const {assignments, courses, toggleAssignment} = useApp();
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(
    () => ({
      all: assignments.length,
      pending: assignments.filter(item => !item.done).length,
      done: assignments.filter(item => item.done).length,
    }),
    [assignments],
  );

  const filtered = useMemo(() => {
    const text = keyword.trim().toLowerCase();

    return assignments
      .filter(item => {
        if (filter === 'pending' && item.done) {
          return false;
        }
        if (filter === 'done' && !item.done) {
          return false;
        }
        if (!text) {
          return true;
        }
        const courseName = getCourseName(courses, item.courseId).toLowerCase();
        return (
          item.title.toLowerCase().includes(text) || courseName.includes(text)
        );
      })
      .sort((a, b) => {
        // Bài chưa nộp lên trước, trong mỗi nhóm thì hạn gần hơn lên trước.
        if (a.done !== b.done) {
          return a.done ? 1 : -1;
        }
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [assignments, courses, filter, keyword]);

  function openAssignment(assignment: Assignment) {
    navigation.navigate('AssignmentDetail', {assignment});
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Tìm theo tên bài tập hoặc môn học..."
        />

        <View style={styles.filterRow}>
          {FILTERS.map(item => {
            const active = item.value === filter;
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.8}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setFilter(item.value)}>
                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}>
                  {item.label} ({counts[item.value]})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <AssignmentCard
            assignment={item}
            courseName={getCourseName(courses, item.courseId)}
            onPress={openAssignment}
            onToggle={toggleAssignment}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: insets.bottom + 16},
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập nào"
            description={
              keyword
                ? `Không có bài tập nào khớp với "${keyword}".`
                : 'Chưa có bài tập nào trong nhóm này.'
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
});

export default AssignmentsScreen;
