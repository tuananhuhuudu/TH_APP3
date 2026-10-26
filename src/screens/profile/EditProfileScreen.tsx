import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AppButton from '../../components/common/AppButton';
import FormInput from '../../components/common/FormInput';
import ScreenContainer from '../../components/common/ScreenContainer';
import {useAppData} from '../../context/AppDataContext';
import {useSync} from '../../context/SyncContext';
import {ProfileStackParamList} from '../../navigation/routes';
import spacing from '../../theme/spacing';
import {
  FormErrors,
  hasNoError,
  isNotEmpty,
  isValidEmail,
  isValidPhone,
} from '../../utils/validators';

type Navigation = NativeStackNavigationProp<ProfileStackParamList>;

export default function EditProfileScreen() {
  const navigation = useNavigation<Navigation>();
  const {student, updateStudent} = useAppData();
  const {isOnline} = useSync();

  const [fullName, setFullName] = useState(student?.fullName ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const [phone, setPhone] = useState(student?.phone ?? '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(student?.fullName ?? '');
    setEmail(student?.email ?? '');
    setPhone(student?.phone ?? '');
  }, [student]);

  function validate(): boolean {
    const next: FormErrors = {};

    if (!isNotEmpty(fullName)) {
      next.fullName = 'Ho ten khong duoc de trong';
    }
    if (!isNotEmpty(email)) {
      next.email = 'Email khong duoc de trong';
    } else if (!isValidEmail(email)) {
      next.email = 'Email khong dung dinh dang';
    }
    if (!isNotEmpty(phone)) {
      next.phone = 'So dien thoai khong duoc de trong';
    } else if (!isValidPhone(phone)) {
      next.phone = 'So dien thoai gom 10 chu so, bat dau bang 0';
    }

    setErrors(next);
    return hasNoError(next);
  }

  async function handleSave() {
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      await updateStudent({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      Alert.alert(
        'Thanh cong',
        isOnline
          ? 'Da cap nhat thong tin ca nhan.'
          : 'Da luu thay doi. Se dong bo khi co mang tro lai.',
      );
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
            label="Ho va ten"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhap ho va ten"
            error={errors.fullName}
            autoCapitalize="words"
          />
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Nhap email"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            label="So dien thoai"
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhap so dien thoai"
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <AppButton
            title="Luu thay doi"
            onPress={handleSave}
            loading={saving}
            style={styles.button}
          />
          <AppButton
            title="Huy"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.button}
          />
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
  button: {
    marginTop: spacing.md,
  },
});
