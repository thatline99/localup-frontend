import { NextRequest, NextResponse } from "next/server";

// 이메일 검증
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 회원가입
async function register(email: string, password: string) {
    const response = await fetch(`${process.env.BACKEND_API_URL}/auth/sign-up`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email, password})  
    })

    if(!response.ok){
        const error = await response.json()
        throw new Error(error.message || '회원가입에 실패했습니다.')
    }

    // 빈 응답 처리
    const responseText = await response.text()
    if (!responseText.trim()) {
        // 백엔드가 빈 응답을 반환한 경우 기본 객체 생성
        return { id: null, email }
    }

    return JSON.parse(responseText)
}

export async function POST(request: NextRequest){
    try{
        const { email, password } = await request.json()

        if(!email || !password) {
            return NextResponse.json(
                {error: '이메일과 비밀번호를 입력해주세요'},
                {status: 400}
            )
        }

        if(!validateEmail(email)){
            return NextResponse.json(
                {error: '이메일 형식이 올바르지 않습니다'},
                {status: 400}
            )
        }

        const user = await register(email, password)

        return NextResponse.json({
            success: true,
            message: '회원가입 완료',
            user: {id: user.id, email: user.email}
        })
    }
    catch(err){
        if(err instanceof Error && err.message.includes('이미 존재')){
            return NextResponse.json(
                {error: '이미 사용중인 이메일'},
                {status: 409}
            )
        }
        
        return NextResponse.json(
            {error: '회원가입 오류 발생', details: err instanceof Error ? err.message : 'Unknown error'},
            {status: 500}
        )
    }
}
