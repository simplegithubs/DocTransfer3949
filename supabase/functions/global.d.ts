// Global declarations for Deno runtime
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): Record<string, string>;
  }
  export const env: Env;

  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: any
  ): any;
  export function serve(
    options: any,
    handler: (request: Request) => Response | Promise<Response>
  ): any;
}

// Module declarations for URL imports
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
    options?: any
  ): any;
  export function serve(
    options: any,
    handler: (request: Request) => Response | Promise<Response>
  ): any;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export * from "@supabase/supabase-js";
}

declare module "https://deno.land/std@0.110.0/crypto/mod.ts" {
  export const crypto: Crypto;
}

// Wildcard modules for other external dependencies
declare module "https://*" {
  const content: any;
  export default content;
}

declare module "npm:*" {
  const content: any;
  export default content;
}
