function requestMatchesToken(request: Request, expectedToken: string | undefined, headerName: string): boolean {
  if (!expectedToken) return false;

  const headerToken = request.headers.get(headerName)?.trim();
  if (headerToken && headerToken === expectedToken) return true;

  const bearer = request.headers.get("authorization")?.trim();
  if (bearer?.toLowerCase().startsWith("bearer ")) {
    const token = bearer.slice(7).trim();
    if (token && token === expectedToken) return true;
  }

  return false;
}

export function isModerationAuthorized(request: Request): boolean {
  return requestMatchesToken(request, process.env.MODERATION_API_TOKEN, "x-moderation-token");
}

export function isOperatorAuthorized(request: Request): boolean {
  return requestMatchesToken(request, process.env.OPERATOR_API_TOKEN ?? process.env.MODERATION_API_TOKEN, "x-operator-token");
}
