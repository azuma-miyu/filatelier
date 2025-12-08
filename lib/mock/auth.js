// モック認証データ（バックエンド準備前の一時的なデータ）
export const mockUsers = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123',
    display_name: '一般ユーザー',
    is_admin: false
  },
  {
    id: 2,
    email: 'admin@admin.com',
    password: 'admin123',
    display_name: '管理者',
    is_admin: true
  }
];

// モックトークン生成
export function generateMockToken(userId) {
  // シンプルなモックトークン（実際のJWTではない）
  return `mock_token_${userId}_${Date.now()}`;
}

// モック認証チェック
export function authenticateMockUser(email, password) {
  const user = mockUsers.find(
    u => u.email === email && u.password === password
  );
  
  if (!user) {
    return null;
  }
  
  // パスワードを除いたユーザー情報を返す
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

