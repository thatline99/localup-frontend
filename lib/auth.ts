import NextAuth, { CredentialsSignin, AuthError } from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Credentials from "next-auth/providers/credentials";

// 커스텀 AuthError 클래스들
class InvalidCredentialsError extends AuthError {
  constructor() {
    super("이메일 또는 비밀번호가 일치하지 않습니다.");
    this.type = "INVALID_CREDENTIALS";
  }
}

class AccountDisabledError extends AuthError {
  constructor() {
    super("이메일 인증이 완료되지 않았습니다.");
    this.type = "ACCOUNT_DISABLED";
  }
}

class ServerError extends AuthError {
  constructor() {
    super("서버 오류가 발생했습니다.");
    this.type = "SERVER_ERROR";
  }
}

class NetworkError extends AuthError {
  constructor() {
    super("네트워크 오류가 발생했습니다.");
    this.type = "NETWORK_ERROR";
  }
}

class MissingCredentialsError extends AuthError {
  constructor() {
    super("이메일과 비밀번호를 입력해주세요.");
    this.type = "MISSING_CREDENTIALS";
  }
}

class InvalidEmailError extends AuthError {
  constructor() {
    super("올바른 이메일 형식이 아닙니다.");
    this.type = "INVALID_EMAIL";
  }
}

class PasswordTooShortError extends AuthError {
  constructor() {
    super("비밀번호는 6자 이상이어야 합니다.");
    this.type = "PASSWORD_TOO_SHORT";
  }
}

// 이메일 정규식 검사 메서드
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email);
}

// 사업정보 등록 필요 여부 확인
async function checkBusinessInfoRequired(cookieHeader: string): Promise<boolean> {
    try {
        
        const response = await fetch(`${process.env.BACKEND_API_URL}/users/business`, {
            method: "GET",
            headers: {
                "Cookie": cookieHeader
            }
        });
        
        if (response.status === 404) {
            return true; // 사업정보 등록 필요
        } else if (response.status === 200) {
            return false; // 사업정보 등록 불필요
        } else {
            return true; // 안전을 위해 등록 필요로 처리
        }
    } catch (error) {
        console.error("사업정보 확인 중 네트워크 오류:", error);
        return true; // 안전을 위해 등록 필요로 처리
    }
}

// 로그인 인증 fetch 처리 메서드
async function authenticateUser(email: string, password: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_API_URL}/auth/sign-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // 쿠키 포함하여 요청
        })

        // 응답 본문을 한번 읽고 로깅
        const responseText = await response.text()
        // console.log(`응답 본문:`, responseText)

        if (response.status === 401){
            throw new InvalidCredentialsError();
        }

        if (response.status === 403) {
            throw new AccountDisabledError();
        }

        if (!response.ok) {
            throw new ServerError();
        }
        
        // 응답 본문이 비어있는 경우 (쿠키만 사용하는 백엔드)
        if (!responseText || responseText.trim() === '') {
            
            // 쿠키에서 accessToken 확인
            const setCookieHeader = response.headers.get('set-cookie');
            if (setCookieHeader && setCookieHeader.includes('accessToken=')) {
                
                // accessToken 추출
                const accessTokenMatch = setCookieHeader.match(/accessToken=([^;]+)/);
                const backendAccessToken = accessTokenMatch ? accessTokenMatch[1] : null;
                
                // 사업정보 등록 여부 확인
                const needsBusinessInfo = await checkBusinessInfoRequired(setCookieHeader);
                
                // 기본 사용자 객체 반환 (실제 사용자 정보는 JWT에서 추출되거나 별도 API 호출 필요)
                return {
                    id: "user", // 임시 ID - 실제로는 JWT 디코딩하거나 별도 API 호출 필요
                    email: email,
                    name: email.split('@')[0], // 임시 이름
                    role: "user",
                    needsBusinessInfo: needsBusinessInfo,
                    backendAccessToken: backendAccessToken
                };
            } else {
                throw new ServerError();
            }
        }
        
        // 응답 본문이 있는 경우 JSON 파싱
        let result;
        try {
            result = JSON.parse(responseText);
            return result;
        } catch (parseError) {
            console.error("JSON 파싱 실패:", parseError)
            throw new ServerError();
        }
    }
    catch (err) {
        
        // AuthError는 다시 throw
        if (err instanceof AuthError) {
            throw err;
        }
        
        // JSON 파싱 에러일 가능성
        if (err instanceof SyntaxError) {
            throw new ServerError();
        }
        
        // 네트워크 에러는 로깅 후 NetworkError로 변환
        throw new NetworkError();
    }
}

/**
 * 카카오 로그인 처리 메서드
 * 1. 기존 회원인지 확인
 * 2. 신규 회원인 경우 자동 회원가입
 * 3. 로그인 처리
 */
async function authKakaoUser(kakaoProfile: any) {
    try {
        
        // 1단계: 카카오 로그인 시도 (기존 회원인 경우 바로 로그인)
        const loginResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/kakao/check`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                kakaoId: parseInt(kakaoProfile.id), // 숫자로 변환
                email: kakaoProfile.email
            })
        });

        const loginResponseText = await loginResponse.text();

        // 로그인 성공인 경우
        if (loginResponse.status === 200) {
            
            // 1. 응답 본문이 있는 경우 JSON으로 처리
            if (loginResponseText && loginResponseText.trim() !== '') {
                try {
                    const userInfo = JSON.parse(loginResponseText);
                    return {
                        ...userInfo,
                        isNewUser: false
                    };
                } catch (parseError) {
                    console.log("JSON 파싱 실패 - 쿠키 기반 로그인으로 처리"+parseError);
                }
            }
            
            // 2. 빈 응답이거나 JSON 파싱 실패 시 쿠키 기반 처리 (백엔드 ResponseEntity<Void> 대응)
            
            // 쿠키 기반 인증인 경우 - 모든 set-cookie 헤더 확인
            const setCookieHeaders = loginResponse.headers.getSetCookie?.() || [];
            const setCookieHeader = loginResponse.headers.get('set-cookie');
            
            // 모든 쿠키 헤더에서 accessToken 찾기
            let backendAccessToken = null;
            
            // 1. 단일 set-cookie 헤더에서 찾기
            if (setCookieHeader && setCookieHeader.includes('accessToken=')) {
                const accessTokenMatch = setCookieHeader.match(/accessToken=([^;,\s]+)/);
                backendAccessToken = accessTokenMatch ? accessTokenMatch[1] : null;
            }
            
            // 2. 여러 set-cookie 헤더에서 찾기 (getSetCookie 사용)
            if (!backendAccessToken && setCookieHeaders.length > 0) {
                for (const cookieHeader of setCookieHeaders) {
                    if (cookieHeader.includes('accessToken=')) {
                        const accessTokenMatch = cookieHeader.match(/accessToken=([^;,\s]+)/);
                        backendAccessToken = accessTokenMatch ? accessTokenMatch[1] : null;
                        break;
                    }
                }
            }
            
            if (backendAccessToken) {
                
                // 사업정보 확인을 위한 쿠키 헤더 준비 (모든 쿠키 포함)
                const cookieHeaderForBusiness = setCookieHeaders.length > 0 ? 
                    setCookieHeaders.join('; ') : 
                    (setCookieHeader || '');
                
                // 기존 사용자의 사업정보 등록 여부 확인
                const needsBusinessInfo = await checkBusinessInfoRequired(cookieHeaderForBusiness);
                
                const userData = {
                    id: kakaoProfile.id,
                    email: kakaoProfile.email,
                    name: kakaoProfile.name,
                    role: "user",
                    provider: "kakao",
                    isNewUser: false,
                    needsBusinessInfo: needsBusinessInfo,
                    backendAccessToken: backendAccessToken
                };
                return userData;
            } else {
                return { error: "KAKAO_LOGIN_TOKEN_NOT_FOUND" };
            }
        }
        
        // 계정 비활성화된 경우 (403)
        if (loginResponse.status === 403) {
            return { error: "KAKAO_ACCOUNT_DISABLED" };
        }

        // 로그인 실패인 경우 (404, 401 등) - 신규 사용자이므로 회원가입 진행
        if (loginResponse.status === 404 || loginResponse.status === 401) {
            
            const signupResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/kakao/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    kakaoId: parseInt(kakaoProfile.id), // 숫자로 변환
                    email: kakaoProfile.email,
                    name: kakaoProfile.name,
                    profileImage: kakaoProfile.image
                })
            });

            const signupResponseText = await signupResponse.text();

            if (signupResponse.status === 200 || signupResponse.status === 201) {
                
                // 1. 응답 본문이 있는 경우 JSON으로 처리
                if (signupResponseText && signupResponseText.trim() !== '') {
                    try {
                        const signupResult = JSON.parse(signupResponseText);
                        return {
                            ...signupResult,
                            isNewUser: true
                        };
                    } catch (parseError) {
                    }
                }
                
                // 2. 빈 응답이거나 JSON 파싱 실패 시 쿠키 기반 처리 (백엔드 ResponseEntity<Void> 대응)
                
                // 쿠키 기반 회원가입인 경우 - 모든 set-cookie 헤더 확인
                const setCookieHeaders = signupResponse.headers.getSetCookie?.() || [];
                const setCookieHeader = signupResponse.headers.get('set-cookie');
                
                // 모든 쿠키 헤더에서 accessToken 찾기
                let backendAccessToken = null;
                
                // 1. 단일 set-cookie 헤더에서 찾기
                if (setCookieHeader && setCookieHeader.includes('accessToken=')) {
                    const accessTokenMatch = setCookieHeader.match(/accessToken=([^;,\s]+)/);
                    backendAccessToken = accessTokenMatch ? accessTokenMatch[1] : null;
                }
                
                // 2. 여러 set-cookie 헤더에서 찾기 (getSetCookie 사용)
                if (!backendAccessToken && setCookieHeaders.length > 0) {
                    for (const cookieHeader of setCookieHeaders) {
                        if (cookieHeader.includes('accessToken=')) {
                            const accessTokenMatch = cookieHeader.match(/accessToken=([^;,\s]+)/);
                            backendAccessToken = accessTokenMatch ? accessTokenMatch[1] : null;
                            break;
                        }
                    }
                }
                
                if (backendAccessToken) {
                    const userData = {
                        id: kakaoProfile.id,
                        email: kakaoProfile.email,
                        name: kakaoProfile.name,
                        role: "user",
                        provider: "kakao",
                        isNewUser: true,
                        needsBusinessInfo: true, // 신규 사용자는 항상 사업정보 등록 필요
                        backendAccessToken: backendAccessToken
                    };
                    return userData;
                } else {
                    return { error: "KAKAO_SIGNUP_TOKEN_NOT_FOUND" };
                }
            } else if (signupResponse.status === 409) {
                // 409 Conflict - 이미 존재하는 사용자 (이메일 중복)
                
                // 기존 사용자로 간주하고 로그인 허용
                const tempUserData = {
                    id: kakaoProfile.id,
                    email: kakaoProfile.email,
                    name: kakaoProfile.name,
                    role: "user",
                    provider: "kakao",
                    isNewUser: false,
                    needsBusinessInfo: false, // 기존 사용자로 가정
                    backendAccessToken: "temp_token_" + Date.now() // 임시 토큰
                };
                return tempUserData;
            } else {
                console.error("❌ 카카오 회원가입 실패:", signupResponse.status, signupResponseText);
                return { error: "KAKAO_SIGNUP_FAILED" };
            }
        }

        // 기타 로그인 오류
        console.error(`❌ 카카오 로그인 실패 - 예상치 못한 응답: ${loginResponse.status}`);
        return { error: "KAKAO_LOGIN_FAILED" };
    }
    catch (err) {
        console.error("카카오 사용자 인증 오류: ", err)
        // 에러 발생 시 에러 정보를 포함한 객체 반환
        return { error: "KAKAO_NETWORK_ERROR" };
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    logger: {
        error: (code, ...message) => {
            // 정상적인 401 응답은 에러로 로깅하지 않음
            if (code !== 'JWT_SESSION_ERROR' && code !== 'SESSION_ERROR') {
                console.error(code, ...message)
            }
        },
        warn: (code, ...message) => {
            // 세션 관련 경고는 무시
            if (code !== 'JWT_SESSION_ERROR' && code !== 'SESSION_ERROR') {
                console.warn(code, ...message)
            }
        },
        debug: () => {}, // debug 로그 비활성화
    },
    providers: [
        Kakao({
            clientId: process.env.AUTH_KAKAO_ID!,
            clientSecret: process.env.AUTH_KAKAO_SECRET!,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    email: profile.kakao_account?.email || "",
                    name: profile.kakao_account?.profile?.nickname || "카카오 사용자",
                    image: profile.kakao_account?.profile?.profile_image_url || null,
                    role: "user",
                    provider: "kakao"
                }
            }
        }),

        Credentials({
            credentials: {
                email: { label: "이메일", type: "email" },
                password: { label: "비밀번호", type: "password" }
            },
            async authorize(credentials) {
                const {email, password} = credentials as {
                    email: string
                    password: string
                }

                if (!email || !password) {
                    throw new MissingCredentialsError();
                }
                
                if (!validateEmail(email.toString())) {
                    throw new InvalidEmailError();
                }
                
                if (password.length < 6) {
                    throw new PasswordTooShortError();
                }

                try {
                    const user = await authenticateUser(email, password);
                    return user ? {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role || "user",
                        provider: "credentials",
                        needsBusinessInfo: user.needsBusinessInfo,
                        backendAccessToken: user.backendAccessToken
                    } : null;
                    
                } catch (error) {
                    // authenticateUser에서 던진 CustomAuthError를 처리
                    if (error instanceof AuthError) {
                        console.log('Auth error caught:', error.type, error.message);
                        // NextAuth는 커스텀 에러 메시지를 잘 전달하지 않으므로 null을 반환하여 로그인 실패 처리
                        return null;
                    }
                    throw error;
                }
            }
        })
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({token, user, account}) {
            
            if(user) {
                token.id = user.id
                token.role = user.role
                token.provider = user.provider

                if(account?.provider === "kakao"){
                    
                    // signIn 콜백에서 이미 인증이 완료되었으므로 사용자 정보만 설정
                    token.id = user.id
                    token.role = user.role || "user"
                    token.provider = "kakao"
                    
                    // 백엔드 accessToken을 NextAuth 토큰에 저장
                    if (user.backendAccessToken) {
                        token.backendAccessToken = user.backendAccessToken
                    } else {
                        console.log("백엔드 토큰이 user 객체에 없음");
                    }
                    
                    // 신규 사용자 여부를 user 객체에서 가져오기
                    if (user.isNewUser !== undefined) {
                        token.isNewUser = user.isNewUser
                        token.needsBusinessInfo = user.needsBusinessInfo || user.isNewUser // 신규 사용자이거나 사업정보가 없는 경우
                    } else {
                        token.isNewUser = false
                        token.needsBusinessInfo = user.needsBusinessInfo || false
                    }
                } else {
                    // 일반 로그인(credentials)의 경우
                    token.id = user.id
                    token.role = user.role || "user"
                    token.provider = "credentials"
                    token.isNewUser = false
                    token.needsBusinessInfo = user.needsBusinessInfo || false
                    
                    // 백엔드 accessToken을 NextAuth 토큰에 저장
                    if (user.backendAccessToken) {
                        token.backendAccessToken = user.backendAccessToken
                    }
                }
            }
            
            console.log("JWT 콜백 최종 토큰:", token);
            return token
        },

        async session({session, token}) {
            // 인증 에러가 있는 경우 세션을 반환하지 않음 (자동 로그아웃)
            if(token?.authError) {
                return null; // 세션을 null로 반환하여 로그아웃 상태로 만듦
            }
            
            if(token) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.provider = token.provider as string
                
                // 백엔드 토큰을 세션에 추가
                if(token.backendAccessToken) {
                    session.user.backendAccessToken = token.backendAccessToken as string
                } else if (token.provider === 'kakao') {
                    // 카카오 사용자인데 백엔드 토큰이 없으면 재로그인 필요
                    session.user.needsReauth = true;
                }
                
                // 사업정보 입력 필요 여부를 세션에 추가
                if(token.needsBusinessInfo !== undefined) {
                    session.user.needsBusinessInfo = token.needsBusinessInfo as boolean
                }
                if(token.isNewUser !== undefined) {
                    session.user.isNewUser = token.isNewUser as boolean
                }
            }
            return session
        },

        async signIn({ user, account, profile }) {
            
            // 카카오 로그인 시 실제 백엔드 인증 체크
            if (account?.provider === "kakao") {
                
                try {
                    
                    const response = await authKakaoUser({
                        id: account.providerAccountId, // 실제 카카오 ID 사용
                        email: user.email,
                        name: user.name,
                        image: user.image
                    });
                    
                    // 에러 응답인 경우 로그인 차단
                    if (response && response.error) {
                        console.log("카카오 인증 실패로 로그인 차단:", response.error);
                        
                        // 에러 타입에 따른 에러 메시지 설정
                        let errorCode = "kakao_auth_failed";
                        if (response.error === "KAKAO_ACCOUNT_DISABLED") {
                            errorCode = "kakao_account_disabled";
                        } else if (response.error === "KAKAO_NETWORK_ERROR") {
                            errorCode = "kakao_network_error";
                        }
                        
                        console.log("리다이렉트로 로그인 차단:", errorCode);
                        
                        // 리다이렉트 URL 반환하여 로그인 페이지로 에러와 함께 이동
                        return `/sign-in?error=${errorCode}`;
                    }
                    
                    
                    // 사용자 객체에 백엔드 응답 정보 추가
                    if (response && !response.error) {
                        user.id = account.providerAccountId; // 실제 카카오 ID로 설정
                        user.isNewUser = response.isNewUser;
                        user.role = response.role || "user";
                        user.backendAccessToken = response.backendAccessToken;
                        user.needsBusinessInfo = response.needsBusinessInfo;
                    }
                    
                    return true;
                } catch (error) {
                    console.error("signIn 콜백에서 카카오 인증 체크 실패:", error);
                    
                    // 네트워크 오류나 기타 예외 발생 시 로그인 차단
                    return `/sign-in?error=kakao_network_error`;
                }
            }

            // 일반 로그인 유저의 경우 사업정보가 없을때의 대처가 없음
            //fix: 일반 로그인 유저에 대하여 처리 로직 추가
            
            return true;
        }
    },

    pages: {
        signIn: "/sign-in",
        error: "/sign-in", // 에러 발생 시 로그인 페이지로 리다이렉트
    },

    // 에러를 클라이언트로 전달
    events: {
        async signIn(message) {
            console.log('signIn event:', message);
        },
        async signOut(message) {
            console.log('signOut event:', message);
        }
    },


    // debug: true // 개발 중에만 활성화
})