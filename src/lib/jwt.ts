import { SignJWT, jwtVerify, decodeJwt } from 'jose';

const encodeSecret = (secret: string) => new TextEncoder().encode(secret);

export const sign = async (
  payload: Record<string, unknown>,
  secret: string,
): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(encodeSecret(secret));
};

export const verify = async <T>(
  token: string,
  secret: string,
): Promise<T | null> => {
  const { payload } = await jwtVerify<T>(token, encodeSecret(secret)).catch(
    () => ({ payload: null }),
  );

  return payload;
};

const jwt = {
  sign,
  verify,
  decode: decodeJwt,
};

export default jwt;
