import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db, verifyPassword } from './db.ts';

const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'shri-goyal-associates-mathura-secret-key-2026';

export interface TokenPayload {
  username: string;
  role: string;
  exp: number;
}

// Simple base64url HMAC token for robust zero-dependency session signing
export function createSessionToken(username: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = Buffer.from(JSON.stringify({ username, role: 'admin', exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  
  if (signature !== expectedSig) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as TokenPayload;
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const payload = verifySessionToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  (req as any).user = payload;
  next();
}

export function authenticateAdminCredentials(password: string): boolean {
  const admin = db.getAdmin();
  return verifyPassword(password, admin.salt, admin.hash);
}
