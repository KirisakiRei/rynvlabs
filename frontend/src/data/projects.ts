import projectLineFollower from "@/assets/project-line-follower.jpg";
import projectQrSaas from "@/assets/project-qr-saas.jpg";
import projectFishPond from "@/assets/project-fish-pond.jpg";
import projectConveyor from "@/assets/project-conveyor.jpg";
import projectInventory from "@/assets/project-inventory.jpg";
import projectScada from "@/assets/project-scada.jpg";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: "software" | "iot" | "automation";
  image: string;
  techStack: string[];
  challenge: string;
  solution: string;
  deepDive: string;
  gallery: string[];
  stats: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    id: "line-follower",
    title: "Line Follower Robot",
    description: "Robot otonom pelacak garis dengan kontrol PID dan obstacle avoidance untuk navigasi warehouse industri.",
    category: "iot",
    image: projectLineFollower,
    techStack: ["C++", "Arduino", "PID Control", "IR Sensors"],
    challenge: "Warehouse membutuhkan sistem transportasi otonom yang hemat biaya dan mampu menavigasi jalur lantai kompleks dengan perubahan infrastruktur minimal.",
    solution: "Kami merancang line follower dengan kontrol PID dan deteksi halangan real-time menggunakan sensor ultrasonik, mencapai akurasi jalur 99.2% pada kecepatan 0.8 m/s.",
    deepDive: "Sistem menggunakan array sensor IR 5-channel yang diproses oleh PID loop yang sudah di-tuning (Kp=2.1, Ki=0.05, Kd=1.8). ESP32 menangani sensor fusion dan motor PWM, sementara sensor ultrasonik memicu emergency stop dalam jarak deteksi 15cm.",
    gallery: [projectLineFollower, projectLineFollower, projectLineFollower],
    stats: [
      { label: "Akurasi Jalur", value: "99.2%" },
      { label: "Kecepatan", value: "0.8 m/s" },
      { label: "Deteksi", value: "<15cm" },
      { label: "Sensor", value: "5-Channel IR" },
    ],
  },
  {
    id: "qr-saas",
    title: "SaaS QR Code Generator",
    description: "Platform QR code enterprise-grade dengan analytics, custom branding, dan kemampuan bulk generation.",
    category: "software",
    image: projectQrSaas,
    techStack: ["Laravel", "React", "PostgreSQL", "Redis", "Stripe"],
    challenge: "Bisnis membutuhkan solusi QR code yang scalable dengan analitik scan terperinci, custom branding, dan akses API untuk integrasi ke workflow yang sudah ada.",
    solution: "Kami membangun platform SaaS multi-tenant yang mendukung 50K+ QR code per akun dengan real-time scan tracking, geo-analytics, dan white-label customization.",
    deepDive: "Arsitektur menggunakan Laravel queues untuk bulk generation (1000 kode/menit), Redis caching untuk scan redirects (<20ms latency), dan React dashboard dengan real-time WebSocket updates untuk scan events.",
    gallery: [projectQrSaas, projectQrSaas],
    stats: [
      { label: "QR/Akun", value: "50K+" },
      { label: "Generasi", value: "1000/min" },
      { label: "Latency", value: "<20ms" },
      { label: "Uptime", value: "99.9%" },
    ],
  },
  {
    id: "smart-fish-pond",
    title: "Smart Fish Pond Scale",
    description: "Sistem penimbangan IoT untuk akuakultur dengan cloud monitoring dan integrasi automated feeding.",
    category: "iot",
    image: projectFishPond,
    techStack: ["ESP32", "MQTT", "Node-RED", "HX711", "React"],
    challenge: "Peternakan akuakultur tidak memiliki tracking biomassa real-time, menyebabkan pemborosan pakan berlebihan dan keputusan panen yang tertunda.",
    solution: "Kami mendesain sistem timbangan IoT waterproof dengan presisi ±5g, telemetri MQTT, dan cloud dashboard yang menampilkan tren pertumbuhan serta rasio konversi pakan.",
    deepDive: "Empat load cell HX711 dalam konfigurasi Wheatstone bridge dihubungkan ke ESP32 dengan Kalman filtering. Data di-stream via MQTT ke Node-RED, yang menghitung FCR dan memicu penyesuaian automated feeder.",
    gallery: [projectFishPond, projectFishPond, projectFishPond],
    stats: [
      { label: "Presisi", value: "±5g" },
      { label: "Protocol", value: "MQTT" },
      { label: "Load Cell", value: "4x HX711" },
      { label: "Filter", value: "Kalman" },
    ],
  },
  {
    id: "plc-conveyor",
    title: "Automated Conveyor System",
    description: "Sistem conveyor multi-zona dengan PLC, sorting, weighing, dan stasiun quality inspection.",
    category: "automation",
    image: projectConveyor,
    techStack: ["Siemens S7-1200", "TIA Portal", "HMI", "Profinet"],
    challenge: "Fasilitas packaging perlu meningkatkan throughput sebesar 40% sekaligus menurunkan error sorting manual dari 8% menjadi di bawah 1%.",
    solution: "Kami mengimplementasikan sistem conveyor PLC 3-zona dengan vision-based sorting, inline weighing, dan reject diversion, mencapai error rate 0.3%.",
    deepDive: "Siemens S7-1200 mengelola zona logic via Profinet I/O. Cognex vision sensor menangani barcode verification, sementara Profinet-connected HX load cells melakukan check-weighing pada 120 item/menit.",
    gallery: [projectConveyor, projectConveyor],
    stats: [
      { label: "Error Rate", value: "0.3%" },
      { label: "Throughput", value: "120/min" },
      { label: "Zona", value: "3 Zona" },
      { label: "Peningkatan", value: "+40%" },
    ],
  },
  {
    id: "inventory-app",
    title: "Inventory Management System",
    description: "Platform inventory full-stack dengan barcode scanning, real-time stock alerts, dan multi-warehouse support.",
    category: "software",
    image: projectInventory,
    techStack: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
    challenge: "Retailer yang berkembang pesat dengan 5 warehouse tidak memiliki visibilitas stok terpadu, menyebabkan overselling dan reorder point yang terlewat.",
    solution: "Kami membangun sistem inventory tercontainerisasi dengan real-time stock sync, automated PO generation, dan mobile barcode scanning untuk proses penerimaan barang.",
    deepDive: "Arsitektur microservices dengan event-driven stock updates via RabbitMQ. MongoDB change streams memicu real-time dashboard updates. Docker Compose mengelola local dev; AWS ECS menangani production dengan auto-scaling.",
    gallery: [projectInventory, projectInventory],
    stats: [
      { label: "Warehouse", value: "5 Lokasi" },
      { label: "Sync", value: "Real-time" },
      { label: "Deploy", value: "Docker" },
      { label: "Cloud", value: "AWS ECS" },
    ],
  },
  {
    id: "scada-monitoring",
    title: "SCADA Monitoring Dashboard",
    description: "Sistem monitoring industri real-time untuk water treatment plant dengan alarm management dan historical trending.",
    category: "automation",
    image: projectScada,
    techStack: ["Python", "Modbus TCP", "InfluxDB", "Grafana", "React"],
    challenge: "Fasilitas water treatment mengandalkan pembacaan gauge manual, melewatkan anomali tekanan kritis yang menyebabkan dua kali shutdown dalam 6 bulan.",
    solution: "Kami men-deploy sistem SCADA-lite yang polling 200+ Modbus register pada interval 1 detik dengan alarm threshold yang dapat dikonfigurasi dan penyimpanan tren 90 hari.",
    deepDive: "Python asyncio menangani Modbus TCP polling dari 8 PLC secara bersamaan. Data time-series mengalir ke InfluxDB dengan retention policies. Grafana menyediakan operator dashboards; custom React app menangani alarm escalation via SMS.",
    gallery: [projectScada, projectScada, projectScada],
    stats: [
      { label: "Register", value: "200+" },
      { label: "Polling", value: "1s Interval" },
      { label: "Retensi", value: "90 Hari" },
      { label: "PLC", value: "8 Unit" },
    ],
  },
];
