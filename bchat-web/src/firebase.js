import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAIRz4SH9MFaw4iU9o764g4elPQiLdTjjo",
  authDomain: "b-chat-10563.firebaseapp.com",
  databaseURL: "https://b-chat-10563-default-rtdb.firebaseio.com",
  projectId: "b-chat-10563",
  storageBucket: "b-chat-10563.firebasestorage.app",
  messagingSenderId: "991172606285",
  appId: "1:991172606285:web:be4a529b7eab686b731f04"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);