import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const PROFILE_PATH = path.join(process.cwd(), '.users-profile.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const token = body.token

    if (!token) {
      return NextResponse.json({ error: '请输入 Token' }, { status: 400 })
    }

    let fileContent = ''
    try {
        fileContent = await fs.readFile(PROFILE_PATH, 'utf-8')
    } catch (readErr) {
        console.error('Failed to read profile file:', readErr)
        return NextResponse.json({ error: '无法读取用户配置文件' }, { status: 500 })
    }

    let users = []
    try {
        users = JSON.parse(fileContent)
    } catch (parseErr) {
         console.error('Failed to parse profile file:', parseErr)
         return NextResponse.json({ error: '用户配置文件格式错误' }, { status: 500 })
    }
    
    // Find user with matching token
    const isValid = Array.isArray(users) && users.some((user: any) => user.token.trim() === token.trim())

    if (isValid) {
      const cookieStore = await cookies()
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax',
      })
      
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '无效的 Token，请检查后重试' }, { status: 401 })
    }
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: '验证过程中发生未知错误' }, { status: 500 })
  }
}
