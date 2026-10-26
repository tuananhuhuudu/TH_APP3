import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import FilterChips, {FilterOption} from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import {useAppData} from '../../context/AppDataContext';
import {useSync} from '../../context/SyncContext';
import {AssignmentStackParamList, ROUTES} from '../../navigation/routes';
import spacing from '../../theme/spacing';
import {Assignment} from '../../types';
import {isOverdue} from '../../utils/date';

type Navigation = NativeStackNavigationProp<AssignmentStackParamList>;

const FILTERS: FilterOption[] = [
  {value: 'all', label: 'Tat ca'},
  {value: 'todo', label: 'Chua xong'},
  {value: 'done', label: 'Da xong'},
  {value: 'overdue', label: 'Qua han'},
];

export default function AssignmentListScreen() {
  const navigation = useNavigation<Navigation>();
  const {
    assignments,
    loading,
    error,
    refreshing,
    lastUpdated,
    refreshAssignments,
    toggleAssignmentStatus,
  } = useAppData();
  const {pendingIds} = useSync();

  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    return assignments.filter(item => {
      if (filter === 'todo') {
        return item.status === 'todo';
      }
      if (filter === 'done') {
        return item.status === 'done';
      }
      if (filter === 'overdue') {
        return item.status === 'todo' && isOverdue(item.dueDate);
      }
      return true;
    });
  }, [assignments, filter]);

  const openDetail = useCallback(
    (assignment: Assignment) => {
      navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, {id: assignment.id});
    },
    [navigation],
  );

  const handleToggle = useCallback(
    async (assignment: Assignment) => {
      try {
        await toggleAssignmentStatus(assignment);
      } catch {
        Alert.alert(
          'Khong cap nhat duoc',
          'Thao tac da duoc hoan tac. Vui long thu lai.',
        );
      }
    },
    [toggleAssignmentStatus],
  );

  const openForm = useCallback(() => {
    navigation.navigate(ROUTES.ASSIGNMENT_FORM);
  }, [navigation]);

  if (loading.assignments && assignments.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Dang tai danh sach bai tap..." />
      </ScreenContainer>
    );
  }

  if (error.assignments && assignments.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView
          message={error.assignments.message}
          onRetry={refreshAssignments}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
        <AppButton title="Them bai tap" onPress={openForm} />
        <LastUpdatedText timestamp={lastUpdated.assignments} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <AssignmentItem
            assignment={item}
            pending={pendingIds.includes(String(item.id))}
            onPress={openDetail}
            onToggleStatus={handleToggle}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={refreshing.assignments}
        onRefresh={refreshAssignments}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="Khong co bai tap nao"
            description="Khong co bai tap nao thuoc nhom dang chon."
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
