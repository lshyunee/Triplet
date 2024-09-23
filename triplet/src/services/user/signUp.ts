import axiosInstance from "../axios";

interface signupData {
    memberId: string;
    password: string;
    passwordConfirm: string;
    name: string;
    phoneNumber: string;
    identificationNumber: string;
}

// 회원가입
export const signup = async(user:signupData) => {
        try {
            const response = await axiosInstance.post('/api/v1/signup', user);
            return response.status;
        }catch(error:any){
            
        }
};

// 휴대폰 인증 요청
export const smsSend = async (phoneNumber: string) => {
    try{
        const response = await axiosInstance.post('/api/v1/sms/send', phoneNumber)
        return response.status;
    }catch(error:any){

    }
};

// 휴대폰 인증 확인
export const smsConfirm = async (phoneNumber: string, certificationNumber:string) => {
    try {
        const response = await axiosInstance.post('/api/v1/sms/confirm',{
            phoneNumber: phoneNumber,
            certificationNumber: certificationNumber
        })
        return response.status;
    }catch(error:any){

    }
}

export {};