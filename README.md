# Admin Paneli Backend

Bu proje, bir Yönetim Paneli (Admin Panel) için geliştirilmiş olan RESTful API servisidir. Node.js, Express.js ve MongoDB kullanılarak oluşturulmuştur. 

## Özellikler

- **Rol Tabanlı Erişim Kontrolü (RBAC):** Kullanıcı, rol ve yetki yönetimi.
- **Kimlik Doğrulama:** JWT (JSON Web Token) tabanlı güvenli doğrulama.
- **Kategori Yönetimi:** Sistem içerikleri için kategori hiyerarşisi oluşturma.
- **Denetim Günlükleri (Audit Logs):** Sistemdeki kullanıcı işlemlerinin kayıt altına alınması.
- **Veri Dışa/İçe Aktarımı:** Excel (.xlsx) dosyaları ile veri yükleme ve indirme desteği.
- **Çoklu Dil Desteği:** i18n entegrasyonu ile birden fazla dilde API yanıtları.

## Kullanılan Teknolojiler

- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB (Mongoose)
- **Güvenlik:** JWT, bcrypt-nodejs (Güncellenmesi önerilir), Passport.js
- **Dosya Yükleme:** Multer
- **Loglama:** Winston, Morgan
- **Diğer:** Node-xlsx, moment, dotenv

## Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### 1. Gereksinimler
- [Node.js](https://nodejs.org/) (v16 veya üstü önerilir)
- [MongoDB](https://www.mongodb.com/) (Lokalde veya Atlas üzerinde)

### 2. Projeyi Klonlama ve Kurulum
Proje klasörüne gidin ve API klasöründeki bağımlılıkları yükleyin:

```bash
cd api
npm install
```

### 3. Çevre Değişkenleri (.env)
`api` klasörü altında `.env` dosyası oluşturun ve aşağıdaki değişkenleri kendi sisteminize göre doldurun:

```env
LOG_LEVEL=debug
CONNECTION_STRING=mongodb://localhost:27017/admin_paneli
PORT=3000
TOKEN_EXPIRE_TIME=86400
FILE_UPLOAD_PATH=./uploads
```
*(Güvenlik notu: Production ortamında güçlü bir JWT Secret kullanılmalıdır. `config/index.js` içindeki sabit değerleri kontrol edin.)*

### 4. Uygulamayı Başlatma
Geliştirme veya canlı ortam için uygulamayı başlatabilirsiniz:

```bash
npm start
```
Varsayılan olarak sunucu `http://localhost:3000` adresinde çalışacaktır.

## Katkıda Bulunma
Katkıda bulunmak için lütfen bir Pull Request (PR) açmadan önce değişikliklerinizi ayrı bir branch üzerinde yapın ve mevcut kod stiline uymaya özen gösterin.
