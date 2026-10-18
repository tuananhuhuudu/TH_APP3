import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import InfoRow from '../components/InfoRow';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import {useApp} from '../data/AppContext';
import {RootStackParamList} from '../navigation/types';
import {GradeItem} from '../types';
import {
  calculateGPA,
  getClassification,
  getCourseName,
  isValidEmail,
  isValidPhone,
} from '../utils/helpers';
import {colors} from '../utils/theme';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Errors = {fullName?: string; email?: string; phone?: string};

function ProfileScreen() {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const {profile, grades, courses, updateProfile} = useApp();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [errors, setErrors] = useState<Errors>({});

  // Đồng bộ lại form khi hồ sơ trong context thay đổi (ví dụ sau khi nạp AsyncStorage).
  useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
  }, [profile]);

  const gpa = calculateGPA(grades, courses);

  function validate(): boolean {
    const next: Errors = {};

    if (!fullName.trim()) {
      next.fullName = 'Họ tên không được để trống';
    }
    if (!email.trim()) {
      next.email = 'Email không được để trống';
    } else if (!isValidEmail(email)) {
      next.email = 'Email không đúng định dạng';
    }
    if (!phone.trim()) {
      next.phone = 'Số điện thoại không được để trống';
    } else if (!isValidPhone(phone)) {
      next.phone = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) {
      return;
    }
    updateProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setEditing(false);
    setErrors({});
    Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân.');
  }

  function handleCancel() {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setErrors({});
    setEditing(false);
  }

  function openGrade(grade: GradeItem) {
    navigation.navigate('GradeDetail', {grade});
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {paddingBottom: insets.bottom + 24},
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.fullName.trim().split(' ').slice(-1)[0]?.[0] ?? '?'}
            </Text>
          </View>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.studentId}>{profile.studentId}</Text>
          <View style={styles.gpaBox}>
            <Text style={styles.gpaValue}>{gpa.toFixed(2)}</Text>
            <Text style={styles.gpaLabel}>GPA · {getClassification(gpa)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader
            title="Thông tin sinh viên"
            actionLabel={editing ? undefined : 'Chỉnh sửa'}
            onPressAction={() => setEditing(true)}
          />

          {editing ? (
            <View>
              <FormInput
                label="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                error={errors.fullName}
                autoCapitalize="words"
              />
              <FormInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormInput
                label="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại"
                error={errors.phone}
                keyboardType="phone-pad"
              />
              <View style={styles.buttonRow}>
                <AppButton
                  title="Huỷ"
                  variant="outline"
                  onPress={handleCancel}
                  style={styles.flexButton}
                />
                <AppButton
                  title="Lưu thay đổi"
                  onPress={handleSave}
                  style={styles.flexButton}
                />
              </View>
            </View>
          ) : (
            <View>
              <InfoRow label="Mã sinh viên" value={profile.studentId} />
              <InfoRow label="Họ và tên" value={profile.fullName} />
              <InfoRow label="Lớp" value={profile.className} />
              <InfoRow label="Ngành học" value={profile.major} />
              <InfoRow label="Email" value={profile.email} />
              <InfoRow label="Số điện thoại" value={profile.phone} />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <SectionHeader title="Kết quả học tập" />
          {grades.map(grade => (
            <TouchableOpacity
              key={grade.id}
              activeOpacity={0.8}
              style={styles.gradeRow}
              onPress={() => openGrade(grade)}>
              <View style={styles.gradeInfo}>
                <Text style={styles.gradeName} numberOfLines={1}>
                  {getCourseName(courses, grade.courseId)}
                </Text>
                <Text style={styles.gradeDetail}>
                  Giữa kỳ {grade.midterm.toFixed(1)} · Cuối kỳ{' '}
                  {grade.final.toFixed(1)}
                </Text>
              </View>
              <View style={styles.gradeRight}>
                <Text style={styles.gradeTotal}>{grade.total.toFixed(1)}</Text>
                <StatusBadge
                  label={grade.letter}
                  tone={grade.total >= 8 ? 'success' : 'primary'}
                />
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 24,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  studentId: {
    marginTop: 2,
    fontSize: 13,
    color: '#ccc',
  },
  gpaBox: {
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  gpaValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  gpaLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  card: {
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  flexButton: {
    flex: 1,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gradeInfo: {
    flex: 1,
  },
  gradeName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  gradeDetail: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  gradeRight: {
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: 8,
  },
  gradeTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  chevron: {
    fontSize: 24,
    color: colors.placeholder,
    marginLeft: 8,
  },
});

export default ProfileScreen;
