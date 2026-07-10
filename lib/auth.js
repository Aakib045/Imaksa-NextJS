import jwt from 'jsonwebtoken';

export function verifyAuth(request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'No token provided' };
  }

  const token = authHeader.slice(7);

  try {
    const admin = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, admin };
  } catch {
    return { valid: false, error: 'Invalid or expired token' };
  }
}
