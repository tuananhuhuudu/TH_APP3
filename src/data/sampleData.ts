import {
  Assignment,
  ClassSession,
  Course,
  GradeItem,
  StudentProfile,
} from '../types';

export const sampleProfile: StudentProfile = {
  studentId: 'B23DCCN004',
  fullName: 'Bùi Duy Tuấn Anh',
  className: 'D23CQCN04-B',
  major: 'Công nghệ thông tin',
  email: 'anhbdt.b23cc004@stu.ptit.edu.vn',
  phone: '0912345678',
};

export const sampleCourses: Course[] = [
  {
    id: 'c1',
    code: 'RIPT1412',
    name: 'Phát triển ứng dụng di động đa nền tảng',
    credits: 3,
    lecturer: '',
    semester: 'Học kỳ 1 - 2026/2027',
    description:
      'Xây dựng ứng dụng di động đa nền tảng với React Native: component, navigation, quản lý trạng thái và lưu trữ dữ liệu cục bộ.',
  },
  {
    id: 'c2',
    code: 'RIPT1411',
    name: 'Lập trình Web nâng cao',
    credits: 3,
    lecturer: '',
    semester: 'Học kỳ 1 - 2026/2027',
    description:
      'Phát triển ứng dụng web hiện đại với Node.js và React, thiết kế RESTful API, xác thực người dùng và tối ưu hiệu năng.',
  },
  {
    id: 'c3',
    code: 'INT1416',
    name: 'Đảm bảo chất lượng phần mềm',
    credits: 3,
    lecturer: '',
    semester: 'Học kỳ 1 - 2026/2027',
    description:
      'Quy trình đảm bảo chất lượng phần mềm, kỹ thuật kiểm thử, quản lý lỗi và các tiêu chuẩn đánh giá chất lượng.',
  },
  {
    id: 'c4',
    code: 'INT1448',
    name: 'Phát triển phần mềm hướng dịch vụ',
    credits: 3,
    lecturer: '',
    semester: 'Học kỳ 1 - 2026/2027',
    description:
      'Kiến trúc hướng dịch vụ (SOA) và microservices, thiết kế và tích hợp dịch vụ web, triển khai hệ thống phân tán.',
  },
  {
    id: 'c5',
    code: 'RIPT1413',
    name: 'Phân tích nghiệp vụ',
    credits: 3,
    lecturer: '',
    semester: 'Học kỳ 1 - 2026/2027',
    description:
      'Khảo sát và phân tích nghiệp vụ, mô hình hoá quy trình, đặc tả yêu cầu và lập tài liệu cho dự án phần mềm.',
  },
  {
    id: 'c6',
    code: 'BAS1153',
    name: 'Lịch sử Đảng Cộng sản Việt Nam',
    credits: 2,
    lecturer: '',
    semester: 'Học kỳ 1 - 2026/2027',
    description:
      'Quá trình ra đời, phát triển và vai trò lãnh đạo của Đảng Cộng sản Việt Nam qua các thời kỳ cách mạng.',
  },
];

// Lịch học dựng theo buổi kế tiếp hiển thị trên trang lớp tín chỉ:
// 13/10/2026 là Thứ 3, 14/10/2026 là Thứ 4. Mỗi môn mới có một buổi;
// phòng học chưa có trên trang đó nên tạm để trống.
export const sampleSessions: ClassSession[] = [
  {
    id: 's1',
    courseId: 'c3',
    weekday: 3,
    startTime: '07:00',
    endTime: '09:25',
    room: '',
    type: 'Lý thuyết',
  },
  {
    id: 's2',
    courseId: 'c4',
    weekday: 3,
    startTime: '09:00',
    endTime: '11:25',
    room: '',
    type: 'Lý thuyết',
  },
  {
    id: 's3',
    courseId: 'c2',
    weekday: 3,
    startTime: '13:00',
    endTime: '15:25',
    room: '',
    type: 'Lý thuyết',
  },
  {
    id: 's4',
    courseId: 'c1',
    weekday: 4,
    startTime: '07:00',
    endTime: '09:25',
    room: '',
    type: 'Lý thuyết',
  },
  {
    id: 's5',
    courseId: 'c5',
    weekday: 4,
    startTime: '09:00',
    endTime: '11:25',
    room: '',
    type: 'Lý thuyết',
  },
];

export const sampleAssignments: Assignment[] = [
  {
    id: 'a1',
    courseId: 'c1',
    title: 'Bài thực hành 3 - Ứng dụng quản lý học tập',
    description:
      'Xây dựng ứng dụng React Native gồm 5 màn hình, kết hợp Bottom Tab và Stack Navigation.',
    dueDate: '2026-10-19',
    done: false,
  },
  {
    id: 'a2',
    courseId: 'c2',
    title: 'Xây dựng RESTful API quản lý sản phẩm',
    description:
      'Thiết kế API CRUD với Node.js và Express, có xác thực JWT và tài liệu Swagger.',
    dueDate: '2026-10-15',
    done: false,
  },
  {
    id: 'a3',
    courseId: 'c3',
    title: 'Báo cáo kế hoạch kiểm thử',
    description:
      'Lập test plan và thiết kế test case cho một module của hệ thống bán hàng.',
    dueDate: '2026-10-13',
    done: false,
  },
  {
    id: 'a4',
    courseId: 'c5',
    title: 'Đặc tả yêu cầu phần mềm (SRS)',
    description:
      'Viết tài liệu SRS cho hệ thống quản lý thư viện theo chuẩn IEEE 830.',
    dueDate: '2026-10-22',
    done: false,
  },
  {
    id: 'a5',
    courseId: 'c4',
    title: 'Thiết kế kiến trúc microservices',
    description:
      'Phân rã hệ thống bán hàng thành các service, mô tả giao tiếp và cơ chế triển khai.',
    dueDate: '2026-10-26',
    done: false,
  },
  {
    id: 'a6',
    courseId: 'c1',
    title: 'Bài thực hành 2 - Quản lý sinh viên',
    description:
      'Ứng dụng danh sách sinh viên với FlatList, tìm kiếm và màn hình chi tiết.',
    dueDate: '2026-10-05',
    done: true,
  },
  {
    id: 'a7',
    courseId: 'c6',
    title: 'Bài thu hoạch chương 2',
    description:
      'Trình bày vai trò lãnh đạo của Đảng trong giai đoạn 1930 - 1945.',
    dueDate: '2026-10-09',
    done: true,
  },
  {
    id: 'a8',
    courseId: 'c2',
    title: 'Bài tập tối ưu truy vấn',
    description:
      'Phân tích và tối ưu 5 truy vấn chậm, kèm kết quả đo trước và sau.',
    dueDate: '2026-10-30',
    done: false,
  },
];

export const sampleGrades: GradeItem[] = [
  {id: 'g1', courseId: 'c1', midterm: 8.5, final: 9.0, total: 8.8, letter: 'A'},
  {id: 'g2', courseId: 'c2', midterm: 7.5, final: 8.0, total: 7.8, letter: 'B+'},
  {id: 'g3', courseId: 'c3', midterm: 7.0, final: 7.5, total: 7.3, letter: 'B'},
  {id: 'g4', courseId: 'c4', midterm: 9.0, final: 8.5, total: 8.7, letter: 'A'},
  {id: 'g5', courseId: 'c5', midterm: 6.5, final: 7.0, total: 6.8, letter: 'C+'},
  {id: 'g6', courseId: 'c6', midterm: 8.0, final: 8.5, total: 8.3, letter: 'B+'},
];
