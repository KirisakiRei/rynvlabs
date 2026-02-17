import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const prisma = new PrismaClient();

// ---- Image seeding helper ----
const FRONTEND_ASSETS = join(__dirname, '..', '..', 'frontend', 'src', 'assets');
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

function ensureUploadDir() {
  const absDir = join(process.cwd(), UPLOAD_DIR);
  if (!existsSync(absDir)) {
    mkdirSync(absDir, { recursive: true });
  }
  return absDir;
}

/**
 * Copy an image from frontend/src/assets to backend/uploads,
 * create a Media record, and return the upload path.
 */
async function seedImage(filename: string): Promise<string> {
  const srcPath = join(FRONTEND_ASSETS, filename);
  if (!existsSync(srcPath)) {
    console.warn(`⚠️  Asset not found: ${filename}, skipping`);
    return `/uploads/${filename}`;
  }

  const absUploadDir = ensureUploadDir();
  const destPath = join(absUploadDir, filename);

  // Copy file (overwrite if exists)
  copyFileSync(srcPath, destPath);

  const stat = statSync(destPath);
  const ext = extname(filename).toLowerCase();
  const mimeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };

  const uploadPath = `/uploads/${filename}`;

  // Upsert media record (avoid duplicates on re-seed)
  await prisma.media.upsert({
    where: { id: await getMediaIdByPath(uploadPath) },
    update: {
      size: stat.size,
    },
    create: {
      filename: filename,
      originalName: filename,
      mimeType: mimeMap[ext] || 'image/jpeg',
      size: stat.size,
      path: uploadPath,
    },
  });

  return uploadPath;
}

async function getMediaIdByPath(path: string): Promise<number> {
  const media = await prisma.media.findFirst({ where: { path } });
  return media?.id ?? 0; // 0 means "not found", will trigger create in upsert
}

async function main() {
  console.log('🌱 Seeding database...');

  // ========== ADMIN ==========
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@rynvlabs.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@rynvlabs.com',
      password: hashedPassword,
    },
  });
  console.log('✅ Admin seeded');

  // ========== TECH STACKS ==========
  const techStacks = [
    { name: 'React', icon: 'SiReact', color: '#61DAFB' },
    { name: 'Laravel', icon: 'SiLaravel', color: '#FF2D20' },
    { name: 'Node.js', icon: 'SiNodedotjs', color: '#339933' },
    { name: 'Docker', icon: 'SiDocker', color: '#2496ED' },
    { name: 'Python', icon: 'SiPython', color: '#3776AB' },
    { name: 'C++', icon: 'SiCplusplus', color: '#00599C' },
    { name: 'Arduino', icon: 'SiArduino', color: '#00979D' },
    { name: 'Raspberry Pi', icon: 'SiRaspberrypi', color: '#A22846' },
    { name: 'ESP32', icon: 'SiEspressif', color: '#E7352C' },
    { name: 'MQTT', icon: 'SiMqtt', color: '#660066' },
    { name: 'PostgreSQL', icon: 'SiPostgresql', color: '#4169E1' },
    { name: 'MongoDB', icon: 'SiMongodb', color: '#47A248' },
    { name: 'Redis', icon: 'SiRedis', color: '#DC382D' },
    { name: 'Stripe', icon: 'SiStripe', color: '#635BFF' },
    { name: 'Grafana', icon: 'SiGrafana', color: '#F46800' },
    { name: 'InfluxDB', icon: 'SiInfluxdb', color: '#22ADF6' },
    { name: 'PID Control', icon: null, color: '#FFB800' },
    { name: 'IR Sensors', icon: null, color: '#CC0000' },
    { name: 'Node-RED', icon: 'SiNodered', color: '#8F0000' },
    { name: 'HX711', icon: null, color: '#00AA00' },
    { name: 'Siemens S7-1200', icon: null, color: '#009999' },
    { name: 'TIA Portal', icon: null, color: '#009999' },
    { name: 'HMI', icon: null, color: '#009999' },
    { name: 'Profinet', icon: null, color: '#009999' },
    { name: 'Modbus TCP', icon: null, color: '#336699' },
    { name: 'AWS', icon: 'SiAmazonwebservices', color: '#FF9900' },
    { name: 'LoRa', icon: null, color: '#1A8FE3' },
    { name: 'pH Sensor', icon: null, color: '#22CC88' },
    { name: 'Fuzzy Logic', icon: null, color: '#FF6600' },
    { name: 'Servo Motor', icon: null, color: '#888888' },
    { name: 'LCD', icon: null, color: '#008800' },
    { name: 'Arduino Mega', icon: 'SiArduino', color: '#00979D' },
    { name: 'OpenCV', icon: 'SiOpencv', color: '#5C3EE8' },
    { name: 'DC Motor', icon: null, color: '#666666' },
    { name: 'Flame Sensor', icon: null, color: '#FF4400' },
    { name: 'Ultrasonic Sensor', icon: null, color: '#4488CC' },
    { name: 'Firebase', icon: 'SiFirebase', color: '#FFCA28' },
    { name: 'Flutter', icon: 'SiFlutter', color: '#02569B' },
  ];

  for (const ts of techStacks) {
    await prisma.techStack.upsert({
      where: { name: ts.name },
      update: { icon: ts.icon, color: ts.color },
      create: ts,
    });
  }
  console.log('✅ Tech stacks seeded');

  // ========== CATEGORIES ==========
  const categories = [
    { name: 'Software', slug: 'software', type: 'PROJECT' as const, color: '#3B82F6' },
    { name: 'IoT', slug: 'iot', type: 'PROJECT' as const, color: '#10B981' },
    { name: 'Automation', slug: 'automation', type: 'PROJECT' as const, color: '#F59E0B' },
  ];

  for (let i = 0; i < categories.length; i++) {
    await prisma.category.upsert({
      where: { slug: categories[i].slug },
      update: {},
      create: { ...categories[i], sortOrder: i + 1 },
    });
  }
  console.log('✅ Categories seeded');

  // ========== SEED IMAGES ==========
  console.log('📷 Seeding images from frontend assets...');
  const imageMap: Record<string, string> = {};
  const assetFiles = [
    'academy-water-quality.jpg',
    'product-smart-scale.jpg',
    'project-conveyor.jpg',
    'project-fish-pond.jpg',
    'project-inventory.jpg',
    'project-line-follower.jpg',
    'project-qr-saas.jpg',
    'project-scada.jpg',
  ];
  for (const file of assetFiles) {
    imageMap[file] = await seedImage(file);
  }
  console.log('✅ Images seeded');

  // ========== PROJECTS ==========
  const projects = [
    {
      title: 'Line Follower Robot',
      slug: 'line-follower',
      description: 'Robot otonom pelacak garis dengan kontrol PID dan obstacle avoidance untuk navigasi warehouse industri.',
      category: 'IOT' as const,
      image: imageMap['project-line-follower.jpg'],
      techStack: ['C++', 'Arduino', 'PID Control', 'IR Sensors'],
      challenge: 'Warehouse membutuhkan sistem transportasi otonom yang hemat biaya dan mampu menavigasi jalur lantai kompleks dengan perubahan infrastruktur minimal.',
      solution: 'Kami merancang line follower dengan kontrol PID dan deteksi halangan real-time menggunakan sensor ultrasonik, mencapai akurasi jalur 99.2% pada kecepatan 0.8 m/s.',
      deepDive: 'Sistem menggunakan array sensor IR 5-channel yang diproses oleh PID loop yang sudah di-tuning (Kp=2.1, Ki=0.05, Kd=1.8). ESP32 menangani sensor fusion dan motor PWM, sementara sensor ultrasonik memicu emergency stop dalam jarak deteksi 15cm.',
      gallery: [imageMap['project-line-follower.jpg']],
      stats: [
        { label: 'Akurasi Jalur', value: '99.2%' },
        { label: 'Kecepatan', value: '0.8 m/s' },
        { label: 'Deteksi', value: '<15cm' },
        { label: 'Sensor', value: '5-Channel IR' },
      ],
      sortOrder: 1,
      isPublished: true,
    },
    {
      title: 'SaaS QR Code Generator',
      slug: 'qr-saas',
      description: 'Platform QR code enterprise-grade dengan analytics, custom branding, dan kemampuan bulk generation.',
      category: 'SOFTWARE' as const,
      image: imageMap['project-qr-saas.jpg'],
      techStack: ['Laravel', 'React', 'PostgreSQL', 'Redis', 'Stripe'],
      challenge: 'Bisnis membutuhkan solusi QR code yang scalable dengan analitik scan terperinci, custom branding, dan akses API untuk integrasi ke workflow yang sudah ada.',
      solution: 'Kami membangun platform SaaS multi-tenant yang mendukung 50K+ QR code per akun dengan real-time scan tracking, geo-analytics, dan white-label customization.',
      deepDive: 'Arsitektur menggunakan Laravel queues untuk bulk generation (1000 kode/menit), Redis caching untuk scan redirects (<20ms latency), dan React dashboard dengan real-time WebSocket updates untuk scan events.',
      gallery: [imageMap['project-qr-saas.jpg']],
      stats: [
        { label: 'QR/Akun', value: '50K+' },
        { label: 'Generasi', value: '1000/min' },
        { label: 'Latency', value: '<20ms' },
        { label: 'Uptime', value: '99.9%' },
      ],
      sortOrder: 2,
      isPublished: true,
    },
    {
      title: 'Smart Fish Pond Scale',
      slug: 'smart-fish-pond',
      description: 'Sistem penimbangan IoT untuk akuakultur dengan cloud monitoring dan integrasi automated feeding.',
      category: 'IOT' as const,
      image: imageMap['project-fish-pond.jpg'],
      techStack: ['ESP32', 'MQTT', 'Node-RED', 'HX711', 'React'],
      challenge: 'Peternakan akuakultur tidak memiliki tracking biomassa real-time, menyebabkan pemborosan pakan berlebihan dan keputusan panen yang tertunda.',
      solution: 'Kami mendesain sistem timbangan IoT waterproof dengan presisi ±5g, telemetri MQTT, dan cloud dashboard yang menampilkan tren pertumbuhan serta rasio konversi pakan.',
      deepDive: 'Empat load cell HX711 dalam konfigurasi Wheatstone bridge dihubungkan ke ESP32 dengan Kalman filtering. Data di-stream via MQTT ke Node-RED, yang menghitung FCR dan memicu penyesuaian automated feeder.',
      gallery: [imageMap['project-fish-pond.jpg']],
      stats: [
        { label: 'Presisi', value: '±5g' },
        { label: 'Protocol', value: 'MQTT' },
        { label: 'Load Cell', value: '4x HX711' },
        { label: 'Filter', value: 'Kalman' },
      ],
      sortOrder: 3,
      isPublished: true,
    },
    {
      title: 'Automated Conveyor System',
      slug: 'plc-conveyor',
      description: 'Sistem conveyor multi-zona dengan PLC, sorting, weighing, dan stasiun quality inspection.',
      category: 'AUTOMATION' as const,
      image: imageMap['project-conveyor.jpg'],
      techStack: ['Siemens S7-1200', 'TIA Portal', 'HMI', 'Profinet'],
      challenge: 'Fasilitas packaging perlu meningkatkan throughput sebesar 40% sekaligus menurunkan error sorting manual dari 8% menjadi di bawah 1%.',
      solution: 'Kami mengimplementasikan sistem conveyor PLC 3-zona dengan vision-based sorting, inline weighing, dan reject diversion, mencapai error rate 0.3%.',
      deepDive: 'Siemens S7-1200 mengelola zona logic via Profinet I/O. Cognex vision sensor menangani barcode verification, sementara Profinet-connected HX load cells melakukan check-weighing pada 120 item/menit.',
      gallery: [imageMap['project-conveyor.jpg']],
      stats: [
        { label: 'Error Rate', value: '0.3%' },
        { label: 'Throughput', value: '120/min' },
        { label: 'Zona', value: '3 Zona' },
        { label: 'Peningkatan', value: '+40%' },
      ],
      sortOrder: 4,
      isPublished: true,
    },
    {
      title: 'Inventory Management System',
      slug: 'inventory-app',
      description: 'Platform inventory full-stack dengan barcode scanning, real-time stock alerts, dan multi-warehouse support.',
      category: 'SOFTWARE' as const,
      image: imageMap['project-inventory.jpg'],
      techStack: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
      challenge: 'Retailer yang berkembang pesat dengan 5 warehouse tidak memiliki visibilitas stok terpadu, menyebabkan overselling dan reorder point yang terlewat.',
      solution: 'Kami membangun sistem inventory tercontainerisasi dengan real-time stock sync, automated PO generation, dan mobile barcode scanning untuk proses penerimaan barang.',
      deepDive: 'Arsitektur microservices dengan event-driven stock updates via RabbitMQ. MongoDB change streams memicu real-time dashboard updates. Docker Compose mengelola local dev; AWS ECS menangani production dengan auto-scaling.',
      gallery: [imageMap['project-inventory.jpg']],
      stats: [
        { label: 'Warehouse', value: '5 Lokasi' },
        { label: 'Sync', value: 'Real-time' },
        { label: 'Deploy', value: 'Docker' },
        { label: 'Cloud', value: 'AWS ECS' },
      ],
      sortOrder: 5,
      isPublished: true,
    },
    {
      title: 'SCADA Monitoring Dashboard',
      slug: 'scada-monitoring',
      description: 'Sistem monitoring industri real-time untuk water treatment plant dengan alarm management dan historical trending.',
      category: 'AUTOMATION' as const,
      image: imageMap['project-scada.jpg'],
      techStack: ['Python', 'Modbus TCP', 'InfluxDB', 'Grafana', 'React'],
      challenge: 'Fasilitas water treatment mengandalkan pembacaan gauge manual, melewatkan anomali tekanan kritis yang menyebabkan dua kali shutdown dalam 6 bulan.',
      solution: 'Kami men-deploy sistem SCADA-lite yang polling 200+ Modbus register pada interval 1 detik dengan alarm threshold yang dapat dikonfigurasi dan penyimpanan tren 90 hari.',
      deepDive: 'Python asyncio menangani Modbus TCP polling dari 8 PLC secara bersamaan. Data time-series mengalir ke InfluxDB dengan retention policies. Grafana menyediakan operator dashboards; custom React app menangani alarm escalation via SMS.',
      gallery: [imageMap['project-scada.jpg']],
      stats: [
        { label: 'Register', value: '200+' },
        { label: 'Polling', value: '1s Interval' },
        { label: 'Retensi', value: '90 Hari' },
        { label: 'PLC', value: '8 Unit' },
      ],
      sortOrder: 6,
      isPublished: true,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { image: p.image, gallery: p.gallery },
      create: p,
    });
  }
  console.log('✅ Projects seeded');

  // ========== ACADEMY PROJECTS ==========
  const academyProjects = [
    {
      title: 'Sistem Monitoring Kualitas Air Tambak',
      slug: 'monitoring-kualitas-air',
      description: 'Sistem IoT untuk pemantauan real-time parameter kualitas air tambak ikan menggunakan sensor pH, suhu, dan DO.',
      techStack: ['ESP32', 'LoRa', 'pH Sensor', 'React', 'MQTT'],
      abstract: 'Penelitian ini merancang dan mengimplementasikan sistem monitoring kualitas air tambak berbasis IoT menggunakan protokol komunikasi LoRa untuk jangkauan luas. Sistem mampu memantau parameter pH, dissolved oxygen (DO), dan suhu air secara real-time dengan akurasi tinggi. Data dikirim ke cloud server dan divisualisasikan melalui web dashboard yang dapat diakses oleh petambak kapan saja.',
      methodology: 'Metodologi penelitian menggunakan pendekatan Research & Development (R&D). Pengembangan perangkat keras meliputi integrasi sensor pH (SEN0161), sensor suhu DS18B20, dan sensor DO (SEN0237) dengan mikrokontroler ESP32. Komunikasi antar node menggunakan modul LoRa SX1276 dengan frekuensi 915MHz. Backend menggunakan Node.js dengan database InfluxDB untuk time-series data.',
      results: 'Hasil pengujian menunjukkan sistem mampu mengirim data setiap 30 detik dengan jangkauan LoRa hingga 2km di area tambak terbuka. Akurasi sensor pH mencapai ±0.1, sensor suhu ±0.5°C, dan sensor DO ±0.3 mg/L. Dashboard web berhasil menampilkan data real-time dan historical trending hingga 30 hari.',
      image: imageMap['academy-water-quality.jpg'],
      wiringDiagram: imageMap['academy-water-quality.jpg'],
      year: 2024,
      sortOrder: 1,
      isPublished: true,
    },
    {
      title: 'Automatic Fish Feeder dengan Kontrol Fuzzy Logic',
      slug: 'smart-feeder-ikan',
      description: 'Sistem pemberi pakan ikan otomatis berbasis Fuzzy Logic yang menyesuaikan jumlah pakan berdasarkan suhu dan kekeruhan air.',
      techStack: ['Arduino Mega', 'Fuzzy Logic', 'Servo Motor', 'LCD', 'C++'],
      abstract: 'Tugas akhir ini mengembangkan sistem pemberi pakan ikan otomatis yang menggunakan metode Fuzzy Logic untuk menentukan jumlah pakan optimal. Input sistem berupa data suhu air dan tingkat kekeruhan (turbidity), yang diproses melalui 25 aturan fuzzy untuk menghasilkan output berupa durasi pemberian pakan. Sistem ini bertujuan mengurangi pemborosan pakan sekaligus menjaga pertumbuhan ikan yang optimal.',
      methodology: 'Perancangan sistem menggunakan mikrokontroler Arduino Mega 2560 dengan sensor suhu DS18B20 dan sensor turbidity SEN0189. Motor servo MG996R digunakan sebagai aktuator untuk membuka katup pakan. Implementasi Fuzzy Logic menggunakan library eFLL (Embedded Fuzzy Logic Library) dengan metode Mamdani. Defuzzifikasi menggunakan metode centroid.',
      results: 'Pengujian selama 30 hari menunjukkan penghematan pakan sebesar 23% dibandingkan pemberian manual. Pertumbuhan ikan meningkat 15% karena pakan yang lebih konsisten. Response time sistem dari pembacaan sensor hingga aktuasi motor adalah 2.3 detik.',
      image: imageMap['project-fish-pond.jpg'],
      wiringDiagram: imageMap['project-fish-pond.jpg'],
      year: 2024,
      sortOrder: 2,
      isPublished: true,
    },
    {
      title: 'Robot Pemadam Api dengan Computer Vision',
      slug: 'robot-pemadam-api',
      description: 'Robot otonom pendeteksi dan pemadam api menggunakan kamera dan algoritma image processing.',
      techStack: ['Raspberry Pi', 'OpenCV', 'Python', 'DC Motor', 'Flame Sensor'],
      abstract: 'Penelitian ini merancang robot otonom yang mampu mendeteksi dan memadamkan sumber api secara mandiri menggunakan computer vision. Robot menggunakan kamera Raspberry Pi dan algoritma deteksi warna api berbasis HSV color space. Sistem navigasi menggunakan kombinasi flame sensor array dan image processing untuk menentukan lokasi dan jarak api.',
      methodology: 'Robot menggunakan Raspberry Pi 4 sebagai main controller dengan kamera Pi Camera V2. Deteksi api menggunakan OpenCV dengan filtering HSV (H: 0-50, S: 50-255, V: 150-255). Navigasi menggunakan 5 flame sensor IR sebagai backup detection. Pemadaman menggunakan fan DC 12V yang diaktifkan ketika jarak api <30cm. Chassis menggunakan platform 4WD dengan motor driver L298N.',
      results: 'Robot berhasil mendeteksi api pada jarak 1-150cm dengan tingkat keberhasilan 94%. Waktu rata-rata dari deteksi hingga pemadaman adalah 45 detik pada arena 4x4 meter. False positive rate sebesar 3% terjadi pada sumber cahaya terang.',
      image: imageMap['project-line-follower.jpg'],
      wiringDiagram: imageMap['project-line-follower.jpg'],
      year: 2023,
      sortOrder: 3,
      isPublished: true,
    },
    {
      title: 'Smart Parking System Berbasis IoT',
      slug: 'smart-parking',
      description: 'Sistem parkir cerdas dengan deteksi slot otomatis, booking via aplikasi mobile, dan monitoring real-time.',
      techStack: ['ESP32', 'Ultrasonic Sensor', 'Firebase', 'Flutter', 'MQTT'],
      abstract: 'Tugas akhir ini mengembangkan sistem parkir cerdas berbasis Internet of Things yang mampu mendeteksi ketersediaan slot parkir secara otomatis dan menampilkannya melalui aplikasi mobile. Sistem menggunakan sensor ultrasonik HC-SR04 pada setiap slot parkir yang terhubung ke ESP32 sebagai gateway. Data dikirim ke Firebase Realtime Database dan divisualisasikan melalui aplikasi Flutter.',
      methodology: 'Setiap slot parkir dilengkapi sensor ultrasonik HC-SR04 yang terhubung ke ESP32 via multiplexer CD74HC4067. Satu ESP32 menangani 16 slot parkir. Komunikasi ke cloud menggunakan WiFi dengan protokol MQTT. Backend menggunakan Firebase dengan Cloud Functions untuk notifikasi. Aplikasi mobile dikembangkan menggunakan Flutter dengan state management Provider.',
      results: 'Sistem berhasil diuji pada 32 slot parkir dengan akurasi deteksi 97.5%. Waktu update status dari sensor ke aplikasi rata-rata 1.2 detik. Fitur booking mengurangi waktu pencarian parkir rata-rata 4.5 menit per kendaraan.',
      image: imageMap['project-scada.jpg'],
      wiringDiagram: imageMap['project-scada.jpg'],
      year: 2023,
      sortOrder: 4,
      isPublished: true,
    },
  ];

  for (const ap of academyProjects) {
    await prisma.academyProject.upsert({
      where: { slug: ap.slug },
      update: { image: ap.image, wiringDiagram: ap.wiringDiagram },
      create: ap,
    });
  }
  console.log('✅ Academy projects seeded');

  // ========== PRODUCTS ==========
  await prisma.product.upsert({
    where: { slug: 'smart-scales' },
    update: { image: imageMap['product-smart-scale.jpg'] },
    create: {
      title: 'Smart Scales',
      slug: 'smart-scales',
      description: 'Timbangan digital presisi tinggi dengan konektivitas IoT, monitoring real-time, dan integrasi cloud untuk industri akuakultur dan manufaktur.',
      image: imageMap['product-smart-scale.jpg'],
      features: [
        { icon: 'Target', title: 'High Precision', desc: 'Presisi hingga ±0.1g dengan load cell kelas industri' },
        { icon: 'Cloud', title: 'Cloud Integration', desc: 'Data real-time ke cloud via MQTT/HTTP' },
        { icon: 'Activity', title: 'Live Monitoring', desc: 'Dashboard monitoring berat secara live' },
        { icon: 'Wifi', title: 'Wireless Connectivity', desc: 'WiFi + LoRa untuk jangkauan luas' },
        { icon: 'Shield', title: 'Industrial Grade', desc: 'IP65 rated, tahan air dan debu' },
        { icon: 'Battery', title: 'Low Power', desc: 'Hemat daya, bisa baterai 72 jam' },
      ],
      specs: 'Kapasitas     : 0.1g - 500kg (configurable)\nPresisi       : ±0.1g (low range) / ±5g (high range)\nKonektivitas  : WiFi 802.11 b/g/n + LoRa 915MHz\nProtokol      : MQTT, HTTP REST API\nDaya          : 5V DC / Li-Ion 3.7V (72h standby)\nProtektor     : IP65 Waterproof Rating\nMCU           : ESP32-WROVER-B\nADC           : HX711 24-bit\nOperating Temp: -10°C to 60°C\nDimensi       : 300 x 300 x 45mm',
      stats: [
        { label: 'Presisi', value: '±0.1g' },
        { label: 'Latency', value: '<50ms' },
        { label: 'Konektivitas', value: 'WiFi + LoRa' },
        { label: 'Daya', value: '72h Battery' },
      ],
      background: 'Industri akuakultur dan manufaktur membutuhkan sistem penimbangan yang tidak hanya akurat, tetapi juga terhubung ke sistem digital untuk monitoring dan analisis data secara real-time. Timbangan konvensional tidak menyediakan konektivitas dan data logging yang dibutuhkan untuk optimasi proses produksi modern.',
      solution: 'Smart Scales mengintegrasikan load cell presisi tinggi dengan mikrokontroler ESP32 dan konektivitas wireless. Sistem mengirimkan data berat secara real-time ke cloud platform, memungkinkan monitoring jarak jauh, historical trending, dan integrasi dengan sistem ERP/MES yang sudah ada.',
      sortOrder: 1,
      isPublished: true,
    },
  });
  console.log('✅ Products seeded');

  // ========== LANDING SECTIONS ==========
  const landingSections = [
    {
      sectionKey: 'hero',
      title: 'Menjembatani Logika Digital dengan Realitas Fisik',
      subtitle: 'Spesialis dalam High-Performance Software, IoT Solutions, dan Industrial Automation.',
      content: {
        ctaPrimary: { text: 'Jelajahi Solusi', link: '#services' },
        ctaSecondary: { text: 'Research Academy', link: '/academy' },
      },
      isVisible: true,
      sortOrder: 1,
    },
    {
      sectionKey: 'services',
      title: 'Apa yang Kami Rekayasa',
      subtitle: null,
      content: {
        items: [
          {
            icon: 'Code',
            title: 'Digital Solutions',
            description: 'Dari web apps high-performance hingga SaaS platforms yang scalable. Kami menulis kode yang bersih, teruji, dan siap produksi.',
            tags: ['React', 'Laravel', 'Node.js'],
          },
          {
            icon: 'Cpu',
            title: 'IoT & Embedded',
            description: 'Merancang firmware, integrasi sensor, dan telemetri cloud. Menjembatani dunia fisik dengan sistem digital.',
            tags: ['ESP32', 'MQTT', 'Firmware'],
          },
          {
            icon: 'Settings',
            title: 'Industrial Automation',
            description: 'Pemrograman PLC, desain HMI, dan implementasi SCADA untuk otomasi manufaktur dan proses industri.',
            tags: ['Siemens', 'PLC', 'HMI'],
          },
          {
            icon: 'FlaskConical',
            title: 'Research & Prototyping',
            description: 'Rapid prototyping dan riset embedded systems. Dari proof-of-concept hingga produk siap pasar.',
            tags: ['Prototyping', 'R&D', 'MVP'],
          },
        ],
      },
      isVisible: true,
      sortOrder: 2,
    },
    {
      sectionKey: 'product',
      title: 'Produk Unggulan',
      subtitle: null,
      content: {
        featuredProductSlug: 'smart-scales',
      },
      isVisible: true,
      sortOrder: 3,
    },
    {
      sectionKey: 'portfolio',
      title: 'Showcase Proyek',
      subtitle: null,
      content: {
        maxItems: 6,
        defaultFilter: 'all',
      },
      isVisible: true,
      sortOrder: 4,
    },
    {
      sectionKey: 'academy',
      title: 'Proyek Tugas Akhir',
      subtitle: 'Kolaborasi riset dan proyek tugas akhir bersama mahasiswa dan institusi akademik.',
      content: {
        maxItems: 3,
      },
      isVisible: true,
      sortOrder: 5,
    },
    {
      sectionKey: 'process',
      title: 'Proses Engineering',
      subtitle: null,
      content: {
        steps: [
          { icon: 'GitBranch', label: 'Logic Design', description: 'Arsitektur & perencanaan' },
          { icon: 'Boxes', label: 'Prototyping', description: 'Bangun & iterasi' },
          { icon: 'Cable', label: 'Integration', description: 'Koneksi & pengujian' },
          { icon: 'Rocket', label: 'Deployment', description: 'Peluncuran & monitoring' },
        ],
      },
      isVisible: true,
      sortOrder: 6,
    },
    {
      sectionKey: 'tech-ticker',
      title: 'Tech Stack',
      subtitle: null,
      content: {
        items: ['React', 'Laravel', 'Docker', 'Python', 'C++', 'Arduino', 'Raspberry Pi', 'Node.js'],
      },
      isVisible: true,
      sortOrder: 7,
    },
    {
      sectionKey: 'contact',
      title: 'Mari Bangun Sesuatu',
      subtitle: 'Konfigurasikan pertanyaan Anda dan langsung terhubung via WhatsApp.',
      content: {
        categories: [
          { icon: 'Globe', label: 'Web Development', waLabel: 'Web Development' },
          { icon: 'CircuitBoard', label: 'IoT Hardware', waLabel: 'IoT Hardware' },
          { icon: 'Factory', label: 'Industrial Automation', waLabel: 'Automation' },
          { icon: 'GraduationCap', label: 'Academy / Riset', waLabel: 'Academy / Riset' },
        ],
      },
      isVisible: true,
      sortOrder: 8,
    },
  ];

  for (const section of landingSections) {
    await prisma.landingSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    });
  }
  console.log('✅ Landing sections seeded');

  // ========== SITE SETTINGS ==========
  const siteSettings = [
    { key: 'brand_name', value: 'rynvlabs' },
    { key: 'wa_number', value: '6283192801660' },
    { key: 'footer_text', value: '© {year} rynvlabs. All rights reserved.' },
    { key: 'meta_title', value: 'rynvlabs — Software, IoT & Automation' },
    { key: 'meta_description', value: 'Spesialis dalam High-Performance Software, IoT Solutions, dan Industrial Automation.' },
    {
      key: 'nav_links',
      value: [
        { label: 'Layanan', href: '#services' },
        { label: 'Produk', href: '#products' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'Academy', href: '/academy' },
        { label: 'Kontak', href: '#contact' },
      ],
    },
    {
      key: 'footer_links',
      value: [
        { label: 'Beranda', href: '/' },
        { label: 'Academy', href: '/academy' },
        { label: 'Portfolio', href: '#portfolio' },
        { label: 'Kontak', href: '#contact' },
      ],
    },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Site settings seeded');

  console.log('');
  console.log('🎉 Seeding completed!');
  console.log('📧 Admin login: admin@rynvlabs.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
