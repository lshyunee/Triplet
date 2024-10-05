// firebase.tsx
// Firebase Cloud Messaging 구성 파일
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import axios from 'axios';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    console.log("권한 요청 중...");

    const permission = await Notification.requestPermission();
    if (permission === "denied") {
        console.log("알림 권한 허용 안됨");
        return permission;
    }

    console.log("알림 권한이 허용됨");

    try {
        const currentToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
        if (currentToken) {
            console.log("token:", currentToken);

            const storedToken = localStorage.getItem('fcmToken');
            if (!storedToken || currentToken !== storedToken) {
                localStorage.setItem('fcmToken', currentToken);
                await axios.post("https://j11b202.p.ssafy.io/api/v1/token", { "token": currentToken });
            }

            return permission;
        } else {
            console.log('등록 토큰을 사용할 수 없습니다. 토큰 생성을 위한 권한을 요청하세요.');
            return permission;
        }
    } catch (err) {
        console.log('토큰을 가져오는 중 오류가 발생했습니다:', err);
        return permission;
    }
}
