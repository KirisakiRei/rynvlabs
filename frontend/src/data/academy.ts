import academyWaterQuality from "@/assets/academy-water-quality.jpg";
import projectFishPond from "@/assets/project-fish-pond.jpg";
import projectLineFollower from "@/assets/project-line-follower.jpg";
import projectScada from "@/assets/project-scada.jpg";

export interface AcademyProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  abstract: string;
  methodology: string;
  results: string;
  image: string;
  wiringDiagram: string;
  year: number;
}

export const academyProjects: AcademyProject[] = [
  {
    id: "monitoring-kualitas-air",
    title: "Sistem Monitoring Kualitas Air Tambak",
    description: "Sistem IoT untuk pemantauan real-time parameter kualitas air tambak ikan menggunakan sensor pH, suhu, dan DO.",
    techStack: ["ESP32", "LoRa", "pH Sensor", "React", "MQTT"],
    abstract: "Penelitian ini merancang dan mengimplementasikan sistem monitoring kualitas air tambak berbasis IoT menggunakan protokol komunikasi LoRa untuk jangkauan luas. Sistem mampu memantau parameter pH, dissolved oxygen (DO), dan suhu air secara real-time dengan akurasi tinggi. Data dikirim ke cloud server dan divisualisasikan melalui web dashboard yang dapat diakses oleh petambak kapan saja.",
    methodology: "Metodologi penelitian menggunakan pendekatan Research & Development (R&D). Pengembangan perangkat keras meliputi integrasi sensor pH (SEN0161), sensor suhu DS18B20, dan sensor DO (SEN0237) dengan mikrokontroler ESP32. Komunikasi antar node menggunakan modul LoRa SX1276 dengan frekuensi 915MHz. Backend menggunakan Node.js dengan database InfluxDB untuk time-series data.",
    results: "Hasil pengujian menunjukkan sistem mampu mengirim data setiap 30 detik dengan jangkauan LoRa hingga 2km di area tambak terbuka. Akurasi sensor pH mencapai ±0.1, sensor suhu ±0.5°C, dan sensor DO ±0.3 mg/L. Dashboard web berhasil menampilkan data real-time dan historical trending hingga 30 hari.",
    image: academyWaterQuality,
    wiringDiagram: academyWaterQuality,
    year: 2024,
  },
  {
    id: "smart-feeder-ikan",
    title: "Automatic Fish Feeder dengan Kontrol Fuzzy Logic",
    description: "Sistem pemberi pakan ikan otomatis berbasis Fuzzy Logic yang menyesuaikan jumlah pakan berdasarkan suhu dan kekeruhan air.",
    techStack: ["Arduino Mega", "Fuzzy Logic", "Servo Motor", "LCD", "C++"],
    abstract: "Tugas akhir ini mengembangkan sistem pemberi pakan ikan otomatis yang menggunakan metode Fuzzy Logic untuk menentukan jumlah pakan optimal. Input sistem berupa data suhu air dan tingkat kekeruhan (turbidity), yang diproses melalui 25 aturan fuzzy untuk menghasilkan output berupa durasi pemberian pakan. Sistem ini bertujuan mengurangi pemborosan pakan sekaligus menjaga pertumbuhan ikan yang optimal.",
    methodology: "Perancangan sistem menggunakan mikrokontroler Arduino Mega 2560 dengan sensor suhu DS18B20 dan sensor turbidity SEN0189. Motor servo MG996R digunakan sebagai aktuator untuk membuka katup pakan. Implementasi Fuzzy Logic menggunakan library eFLL (Embedded Fuzzy Logic Library) dengan metode Mamdani. Defuzzifikasi menggunakan metode centroid.",
    results: "Pengujian selama 30 hari menunjukkan penghematan pakan sebesar 23% dibandingkan pemberian manual. Pertumbuhan ikan meningkat 15% karena pakan yang lebih konsisten. Response time sistem dari pembacaan sensor hingga aktuasi motor adalah 2.3 detik.",
    image: projectFishPond,
    wiringDiagram: projectFishPond,
    year: 2024,
  },
  {
    id: "robot-pemadam-api",
    title: "Robot Pemadam Api dengan Computer Vision",
    description: "Robot otonom pendeteksi dan pemadam api menggunakan kamera dan algoritma image processing.",
    techStack: ["Raspberry Pi", "OpenCV", "Python", "DC Motor", "Flame Sensor"],
    abstract: "Penelitian ini merancang robot otonom yang mampu mendeteksi dan memadamkan sumber api secara mandiri menggunakan computer vision. Robot menggunakan kamera Raspberry Pi dan algoritma deteksi warna api berbasis HSV color space. Sistem navigasi menggunakan kombinasi flame sensor array dan image processing untuk menentukan lokasi dan jarak api.",
    methodology: "Robot menggunakan Raspberry Pi 4 sebagai main controller dengan kamera Pi Camera V2. Deteksi api menggunakan OpenCV dengan filtering HSV (H: 0-50, S: 50-255, V: 150-255). Navigasi menggunakan 5 flame sensor IR sebagai backup detection. Pemadaman menggunakan fan DC 12V yang diaktifkan ketika jarak api <30cm. Chassis menggunakan platform 4WD dengan motor driver L298N.",
    results: "Robot berhasil mendeteksi api pada jarak 1-150cm dengan tingkat keberhasilan 94%. Waktu rata-rata dari deteksi hingga pemadaman adalah 45 detik pada arena 4x4 meter. False positive rate sebesar 3% terjadi pada sumber cahaya terang.",
    image: projectLineFollower,
    wiringDiagram: projectLineFollower,
    year: 2023,
  },
  {
    id: "smart-parking",
    title: "Smart Parking System Berbasis IoT",
    description: "Sistem parkir cerdas dengan deteksi slot otomatis, booking via aplikasi mobile, dan monitoring real-time.",
    techStack: ["ESP32", "Ultrasonic Sensor", "Firebase", "Flutter", "MQTT"],
    abstract: "Tugas akhir ini mengembangkan sistem parkir cerdas berbasis Internet of Things yang mampu mendeteksi ketersediaan slot parkir secara otomatis dan menampilkannya melalui aplikasi mobile. Sistem menggunakan sensor ultrasonik HC-SR04 pada setiap slot parkir yang terhubung ke ESP32 sebagai gateway. Data dikirim ke Firebase Realtime Database dan divisualisasikan melalui aplikasi Flutter.",
    methodology: "Setiap slot parkir dilengkapi sensor ultrasonik HC-SR04 yang terhubung ke ESP32 via multiplexer CD74HC4067. Satu ESP32 menangani 16 slot parkir. Komunikasi ke cloud menggunakan WiFi dengan protokol MQTT. Backend menggunakan Firebase dengan Cloud Functions untuk notifikasi. Aplikasi mobile dikembangkan menggunakan Flutter dengan state management Provider.",
    results: "Sistem berhasil diuji pada 32 slot parkir dengan akurasi deteksi 97.5%. Waktu update status dari sensor ke aplikasi rata-rata 1.2 detik. Fitur booking mengurangi waktu pencarian parkir rata-rata 4.5 menit per kendaraan.",
    image: projectScada,
    wiringDiagram: projectScada,
    year: 2023,
  },
];
