# Thuc hanh 4 - Ung dung Quan ly hoc tap

Ung dung React Native lay du lieu tu REST API (json-server), van dung duoc khi
mat mang va tu dong bo khi co mang tro lai.

Sinh vien: Bui Duy Tuan Anh - B23DCCN004 - D23CQCN04-B

## Chay ung dung

Buoc 1: cai thu vien

```bash
npm install
```

Buoc 2: chay server gia lap

```bash
npm install -g json-server@0.17.4
json-server --watch db.json --host 0.0.0.0 --port 3000 --delay 800
```

Buoc 3: sua `BASE_URL` trong `src/config.ts`

- May ao Android: `http://10.0.2.2:3000` (da dat san)
- Dien thoai that: sua bien `LAN_IP` thanh IP may tinh, hai may cung Wi-Fi

Buoc 4: chay app

```bash
npm start
npm run android
```

## So do luong du lieu

```
Man hinh -> Context -> Hook -> Service -> API
                        |
                        +--> Cache / Outbox (AsyncStorage)
```

Chi tiet:

```
screens/          doc du lieu qua useAppData()
   |
context/          AppDataContext, SyncContext
   |
hooks/            useCachedQuery, useNetworkStatus, useOutboxSync
   |
   +-- co mang -> api/*Service -> api/client -> json-server
   |
   +-- mat mang -> storage/cache.ts, storage/outbox.ts -> AsyncStorage
```

Doc du lieu (cache truoc, mang sau):

1. Hien du lieu trong cache ngay khi mo man hinh.
2. Goi API de lam moi neu con mang, ghi de cache kem `savedAt`.
3. Goi API that bai ma con cache thi giu cache, khong bao loi.
4. Khong co cache va khong goi duoc API thi hien `ErrorView` co nut thu lai.

Ghi du lieu:

- Con mang: cap nhat giao dien ngay, goi API. API loi thi hoan tac.
- Mat mang: cap nhat giao dien ngay, day thao tac vao hang doi outbox.
  Muc trong hang doi hien nhan "Chua dong bo".

## Xu ly xung dot

Dat trong `src/hooks/useOutboxSync.ts`.

Khi mat mang, moi thao tac PATCH duoc luu kem `baseUpdatedAt` - gia tri
`updatedAt` cua ban ghi luc nguoi dung thao tac.

Khi co mang tro lai, truoc moi PATCH:

1. Goi GET lay `updatedAt` hien tai tren may chu.
2. Neu may chu moi hon `baseUpdatedAt` thi **uu tien du lieu may chu**, bo thao
   tac offline va xoa khoi hang doi.
3. Nguoc lai thi gui PATCH binh thuong.
4. Bao ket qua: "Da dong bo 3 thay doi", "1 thay doi bi bo qua vi du lieu tren
   may chu moi hon".

Ly do: du lieu may chu la nguon chung cho nhieu thiet bi, nen khi mau thuan thi
uu tien ban moi nhat de tranh ghi de mat du lieu. Nguoi dung luon duoc bao.

Thao tac loi vi ly do khac (mat mang giua chung, may chu loi) thi giu lai trong
hang doi de thu lai lan sau.

## Cau truc thu muc

```
src/
  config.ts       BASE_URL, TIMEOUT, CACHE_TTL
  api/            client + 5 service
  storage/        keys, cache, outbox
  context/        AppDataContext, SyncContext
  hooks/          useNetworkStatus, useCachedQuery, useOutboxSync
  navigation/     routes + Bottom Tab + 5 Native Stack
  screens/        5 man hinh chinh, 7 man hinh chi tiet
  components/     common, course, schedule, assignment, grade, profile
  theme/          colors, spacing, typography
  utils/          date, gpa, validators
  types/          Kieu du lieu
```

## Cong thuc tinh diem

`total = 10% chuyen can + 30% giua ky + 60% cuoi ky`

| Diem he 10 | Diem chu | He 4 |
| --- | --- | --- |
| 8,5 - 10 | A | 4,0 |
| 8,0 - 8,4 | B+ | 3,5 |
| 7,0 - 7,9 | B | 3,0 |
| 6,5 - 6,9 | C+ | 2,5 |
| 5,5 - 6,4 | C | 2,0 |
| 5,0 - 5,4 | D+ | 1,5 |
| 4,0 - 4,9 | D | 1,0 |
| Duoi 4,0 | F | 0 |

`GPA = tong (he 4 x tin chi) / tong tin chi`. Mon diem F khong tinh tin chi.

## Cong nghe

React Native 0.87 (TypeScript), React Navigation, AsyncStorage, NetInfo,
Context API, json-server.
