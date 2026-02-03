import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import crypto from 'node:crypto';

const USERS_FILE = path.join(process.cwd(), '.users-profile.json');

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    // 1. Check and read file
    let users: any[] = [];
    try {
      const content = await fs.readFile(USERS_FILE, 'utf-8');
      users = JSON.parse(content);
      if (!Array.isArray(users)) {
        users = [];
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // If file doesn't exist, start with empty array
    }

    // 2. Ask for username
    const name = await rl.question('请输入用户名: ');
    
    if (!name.trim()) {
      console.error('错误: 用户名不能为空');
      process.exit(1);
    }

    // 3. Check existence
    if (users.find(u => u.name === name.trim())) {
      console.error('错误: 该用户名已存在');
      process.exit(1);
    }

    // 4. Generate token
    // Requirement: "64位生成"
    // Generating a random token with 64 characters (hex encoding of 32 bytes)
    const token = crypto.randomBytes(32).toString('hex');

    // 5. Insert
    users.push({
      name: name.trim(),
      token: token
    });

    // 6. Save
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    
    console.log(`\n成功! 用户 "${name.trim()}" 已添加。`);
    console.log(`生成的 Token (64位): ${token}`);

  } catch (error) {
    console.error('发生错误:', error);
  } finally {
    rl.close();
  }
}

main();
