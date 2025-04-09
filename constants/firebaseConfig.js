// firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5gmvSNNdazFFJZvOvkwCKv58BcUMjJxU",
  authDomain: "clothing-store-1165d.firebaseapp.com",
  projectId: "clothing-store-1165d",
  storageBucket: "clothing-store-1165d.appspot.com",
  messagingSenderId: "276500725099",
  appId: "1:276500725099:web:26e14c3d98897cbd4ca02e",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các dịch vụ cần dùng
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
