import { createHmac, timingSafeEqual } from "crypto";

type JwtPayload = {
  sub: string;
  role: "WRITER" | "EDITOR" | "ADMIN";
  type: "access" | "refresh";
  iat: number;
  exp: number;
};

const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30;

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf-8");
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function assertSecret(secret: string | undefined): string {
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long");
  }

  return secret;
}

function createToken(payload: Omit<JwtPayload, "iat" | "exp">, ttlSeconds: number): string {
  const secret = assertSecret(process.env.JWT_SECRET);
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ttlSeconds;

  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const body: JwtPayload = {
    ...payload,
    iat,
    exp
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const signature = sign(`${encodedHeader}.${encodedBody}`, secret);

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

export function createAccessToken(subject: string, role: JwtPayload["role"]): string {
  return createToken(
    {
      sub: subject,
      role,
      type: "access"
    },
    ACCESS_TTL_SECONDS
  );
}

export function createRefreshToken(subject: string, role: JwtPayload["role"]): string {
  return createToken(
    {
      sub: subject,
      role,
      type: "refresh"
    },
    REFRESH_TTL_SECONDS
  );
}

export function verifyToken(token: string): JwtPayload | null {
  const secret = assertSecret(process.env.JWT_SECRET);
  const [encodedHeader, encodedBody, encodedSignature] = token.split(".");

  if (!encodedHeader || !encodedBody || !encodedSignature) {
    return null;
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedBody}`, secret);
  const actualBuf = Buffer.from(encodedSignature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) {
    return null;
  }

  let payload: JwtPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedBody)) as JwtPayload;
  } catch {
    return null;
  }

  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
