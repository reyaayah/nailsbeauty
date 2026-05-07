import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// Firebase — CLIENT-SIDE (browser-safe, NEXT_PUBLIC_* prefix)
// ─────────────────────────────────────────────────────────────────────────────
const clientFirebase = {
  NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyCG-eZuOecjQYs5dNAUv5QOl5Bmvjv0sP0",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "nailsbeauty-978c5.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "nailsbeauty-978c5",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "nailsbeauty-978c5.firebasestorage.app",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "402268561511",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:402268561511:web:df3bd2d1ae70875ccef4c2",
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-1EJKR5GZ03",
};

// ─────────────────────────────────────────────────────────────────────────────
// Firebase — SERVER-SIDE Admin SDK (never exposed to browser)
// ─────────────────────────────────────────────────────────────────────────────
const adminFirebase = {
  FIREBASE_PROJECT_ID: "nailsbeauty-978c5",
  FIREBASE_CLIENT_EMAIL: "firebase-adminsdk-fbsvc@nailsbeauty-978c5.iam.gserviceaccount.com",
  FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDyW8/AAE2WmjXQ\nmSoaf9x5kJhj9Jv1ptZgQFKUETl9iE2HWHQcC3NO6DnT73DSoPDvc0QkWAqijtMC\nKJp9GeRxwqozdwt4YSLNo6aMoxRwH/46Id0kq218Eg+e712OzGFobC9xVWt/KFp+\nDsq7rxI2vTFMg8YfyOZEMPQY61Y9Bnxsrgj3Yj5CJv5Vvs9ThA5D24Ydfl0G6REa\nNyz9R4BnKc6boCM7vSMXtIMgcoS7Qol4HcG/oROGwMbm2IGz7aJX5HGDTiOe5xye\napBCxG1MuU4TOeeBKv5fN+2gK8zDi2g7QKP8DfrbQj7kAiURzGYcihBZboKoQI0A\nuBEuj3VfAgMBAAECggEADW6x2ebj/5WMp2lg/R00ESRgX3EQI2Vu561fX+e0FrVZ\njEeGdYPbwE/vqiodrmOo87FUSAPKYLSz+wa/SHEi1hYSpkD4iK0wwOv+kAUXEP9w\nJDTg4Fm3lJ/qb+xW9GvdRDlzlOXFzCmzTKqxaTiS5/TEop4berYar3hB6lwOW6bN\ndzTVg/V5z92Y9gfnVbCQd6aonpP+Hv7zVD+ReswbLn6arRtlU9fYhm/EfbuXwwaY\nJ0IDnUzufg+9fIkcOYz3wbOf8QEEKh1ZAIE5vxeGoKNA3JqTAueMdKbko/FvJTox\nHMWMwLz0c29yz+SChZ07OUhBYRUED6h088XGoriuTQKBgQD5jG+OU8lx9PX5b4fb\nSqaEr1iWqQoNKT+T94OgworXAFZsYd8is3EtbJpvlfI0oMp3dyWzlTdP/bvhHo6B\n8udmsT0O+ERNMLQej+EkH9/lvak28nnjNbedtrWYBMUkYjmJ/T2/WYjCf+BIFA2F\nHFdMnKxxnf4IURh2ofEudKz3FQKBgQD4n8qPpGhx0zTH5A980f2dhker/0Edw2kl\noRO2zRDipPtgGnhp38/kHQRm8947uDmHaSG+1z61dgtAWzkxUUJ4f1liD9SX19iS\n9BzEzB8GiTNLZeMfBZLmAtTNWQ+nCzTK+AdPddm0LLuaSr37TC9Q36lyhKnjCAzK\nTOiWiB5XowKBgQCywzJKr6S3uHXX+FhG8+PzWrTIQFFN+kVsFru5FoNk3v4J59Zz\nQj4J/ylmU/DMWH6RM83TJkoYSDglXMFTP5EaVE7cAWbUMNZmqkTqntbB+apVDT/Z\nTmq5VOAjBQ/AL4juW3W3NEkuo3Ij0BGbUCENZZJ2VWpbxNQUb4+Y6sXYvQKBgBZd\nETRgfoCWle3RBs+cd+qedH31JN9Pf3rCBWrxAS7R1karut8TIbkMHyQ/lWLbzFjw\nzPdEl0BtUM/GJNvZylfaZKjccawC31lAmgHdtoC5AKMslARrVO5ZnNinxS+qY2JK\ncyXjnOSHDYzwYixjivIEXFKPulRQmg3sYxN/RPNvAoGAOzUrOeAvkYaRfUWaZUNj\nSpI+3/T23hKUmpV76pTJI06fFM3vKNnArucT8X7T8y/WeOwvDP1eksC8cS5sAE9X\nQzRmd1rD39xEXNlRZa3OxITq8pHbo0YyULehZ7PWZ60qkkBhvnmq1ybEaaOt194e\nM6Jvf3s6HWngtxa7PjundX8=\n-----END PRIVATE KEY-----\n",
};

// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare R2 — used by /api/admin/upload route
// ─────────────────────────────────────────────────────────────────────────────
const cloudflareR2 = {
  NEXT_PUBLIC_R2_ENDPOINT: "https://9aeac94ae706da39970cfebc2424b877.r2.cloudflarestorage.com",
  NEXT_PUBLIC_R2_ACCESS_KEY_ID: "8ee0c3afbc4470d1063f41acede397c8",
  NEXT_PUBLIC_R2_SECRET_ACCESS_KEY: "863480dbe9d6d5c03b25b0ea26dab54aee6c2545e7701c6d6568194b98e95cd2",
  NEXT_PUBLIC_R2_BUCKET_NAME: "nailsa",
  NEXT_PUBLIC_R2_PUBLIC_URL: "https://pub-1f5f31cf3f764b058ee30785bec47206.r2.dev",
};

const smtp = {
  SMTP_HOST: "smtp.gmail.com",           // e.g. smtp.gmail.com / smtp.resend.com
  SMTP_PORT: "587",
  SMTP_SECURE: "false",                  // "true" for port 465
  SMTP_USER: "riyaawal7@gmail.com",           // sending account / API key username
  SMTP_PASS: "vlpl brnz njxs ptpp",        // app password or API key
  SMTP_FROM: 'riyaawal7@gmail.com',
};
const brand = {
  NEXT_PUBLIC_BRAND_NAME: "Nailsa",
};
const nextConfig: NextConfig = {
  env: {
    ...clientFirebase,
    ...adminFirebase,
    ...cloudflareR2,
    ...smtp,
    ...brand,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
};

export default nextConfig;