import axiosInstance from "../axios"


// 로그인
export const login = async (memberId: string, password: string) => {
    try{
        const formData = new FormData();
        formData.append('memberId', memberId);
        formData.append('password', password);

        const response = await axiosInstance.post('/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // FormData를 사용하기 위한 Content-Type 설정
            },
        });

        return response.status;
    }catch(error:any){
        
    }
};

// 네이버 로그인
export const naverLogin = async () => {
    try{
        const response = await axiosInstance.post('/oauth2/authorization/naver');
        return response.status;
    }catch(error:any){

    }
}

// 로그아웃
export const logout = async () => {
    try{
       await axiosInstance.post('/auth/login');
    }catch(error:any){

    }
};

// 토큰 갱신
export const refreshToken = async () => {
    try{
        const response = await axiosInstance.post('/api/v1/reissue');
        return response.data;
    }catch(error:any){

    }
};