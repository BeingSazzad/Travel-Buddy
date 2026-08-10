import { createClient, createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

function resolveAppId(request: Request, fallbackAppId?: string) {
  return (
    request.headers.get('Base44-App-Id') ||
    fallbackAppId ||
    Deno.env.get('BASE44_APP_ID') ||
    Deno.env.get('VITE_BASE44_APP_ID') ||
    null
  );
}

function resolveServerUrl(request: Request) {
  return (
    request.headers.get('Base44-Api-Url') ||
    Deno.env.get('BASE44_APP_BASE_URL') ||
    Deno.env.get('VITE_BASE44_APP_BASE_URL') ||
    'http://localhost:4400'
  );
}

export function createBase44ClientFromRequest(request: Request, fallbackAppId?: string) {
  if (request.headers.get('Base44-App-Id')) {
    return createClientFromRequest(request);
  }

  const appId = resolveAppId(request, fallbackAppId);
  if (!appId) {
    throw new Error(
      'Base44 app id is required. Set BASE44_APP_ID or VITE_BASE44_APP_ID, or include base44_app_id in Stripe metadata.'
    );
  }

  const serviceAuth = request.headers.get('Base44-Service-Authorization');
  const serviceToken = serviceAuth?.startsWith('Bearer ')
    ? serviceAuth.split(' ')[1]
    : undefined;

  return createClient({
    appId,
    serverUrl: resolveServerUrl(request),
    serviceToken,
  });
}
