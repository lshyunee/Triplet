// Firebase Cloud Messaging 구성 파일
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import useAxios from '../hooks/useAxios';
import axios from 'axios';
// Firebase 구성
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


async function requestPermission() {
  console.log("권한 요청 중...");

  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    console.log("알림 권한 허용 안됨");
    return;
  }

  console.log("알림 권한이 허용됨");

  const token = await  getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY }) // 지원하는 웹 푸시 서비스에 요청을 허용하기 위한 인증
  .then((currentToken) => {
      if (currentToken) {

        if (currentToken) console.log("token: ", currentToken);
        else { console.log("Can not get Token");
            return ;
        }
        // 로컬 스토리지에 이전 토큰이 저장되어 있고 현재 토큰과 다를 경우 갱신
        if (localStorage.getItem('fcmToken') && currentToken !== localStorage.getItem('fcmToken')) {
            localStorage.setItem('fcmToken', currentToken);
            axios.post("https://j11b202.ssafy.io/api/v1/token",{
            "token":currentToken
            }).then((res) => {
            console.log(res)
            })   
        }
        // 로컬 스토리지에 토큰이 없을 경우 새로 저장
        else if (!localStorage.getItem('fcmToken')) {
            localStorage.setItem('fcmToken', currentToken);
            axios.post("https://j11b202.ssafy.io/api/v1/token",{
                "token":currentToken
                }).then((res) => {
                console.log(res)
                })   
        }

          // 토큰 반환
          return currentToken;
      } else {
          console.log('등록 토큰을 사용할 수 없습니다. 토큰 생성을 위한 권한을 요청하세요.');
          return null;
      }
  })
  .catch((err) => {
      console.log('토큰을 가져오는 중 오류가 발생했습니다: ', err);
      return null;
  });


//   onMessage(messaging, (payload) => {
//     console.log("메시지가 도착했습니다.", payload);
//     // ...
//   });
}

requestPermission()