import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppButton from '../../components/common/AppButton';
import FilterChips, {FilterOption} from '../../components/common/FilterChips';
import FormInput from '../../components/common/FormInput';
import ScreenContainer from '../../components/common/ScreenContainer';
import {useAppData} from '../../context/AppDataContext';
import {AssignmentStackParamList} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import {
  FormErrors,
  hasNoError,
  isFutureDate,
  isNotEmpty,
  parseDateInput,
} from '../../utils/validators';

type Navigation = NativeStackNavigationProp<AssignmentStackParamList>;

export default function AssignmentFormScreen() {
  const navigation = useNavigation<Navigation>();
  const {courses, createAssignment} = useAppData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [courseId, setCourseId] = useState(
    courses.length > 0 ? String(courses[0].id) : '',
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const courseOptions: FilterOption[] = courses.map(c => ({
    value: String(c.id),
    label: c.code,
  }));

  function validate(): string | null {
    const next: FormErrors = {};

    if (!isNotEmpty(title)) {
      next.title = 'Tieu de khong duoc de trong';
    }

    const iso = parseDateInput(dueDate);
    if (!iso) {
      next.dueDate = 'Han nop theo dinh dang dd/MM/yyyy';
    } else if (!isFutureDate(iso)) {
      next.dueDate = 'Han nop khong duoc o qua khu';
    }

    if (!courseId) {
      next.courseId = 'Phai chon mot mon hoc';
    }

    setErrors(next);
    return hasNoError(next) ? iso : null;
  }

  async function handleSave() {
    const iso = validate();
    if (!iso) {
      return;
    }

    setSaving(true);
    try {
      await createAssignment({
        courseId: Number(courseId),
        title: title.trim(),
        description: description.trim(),
        dueDate: iso,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Khong luu duoc', 'Vui long kiem tra ket noi va thu lai.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <FormInput
            label="Tieu de"
            value={title}
            onChangeText={setTitle}
            placeholder="Nhap ten bai tap"
            error={errors.title}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Mon hoc</Text>
            <FilterChips
              options={courseOptions}
              selected={courseId}
              onSelect={setCourseId}
            />
            {errors.courseId ? (
              <Text style={styles.error}>{errors.courseId}</Text>
            ) : null}
          </View>

          <FormInput
            label="Han nop (dd/MM/yyyy)"
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="31/12/2026"
            keyboardType="numbers-and-punctuation"
            error={errors.dueDate}
          />

          <FormInput
            label="Mo ta"
            value={description}
            onChangeText={setDescription}
            placeholder="Mo ta yeu cau cua bai tap"
            multiline
          />

          <View style={styles.buttonRow}>
            <AppButton
              title="Huy"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.flexButton}
            />
            <AppButton
              title="Luu bai tap"
              onPress={handleSave}
              loading={saving}
              style={styles.flexButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  flexButton: {
    flex: 1,
  },
});
