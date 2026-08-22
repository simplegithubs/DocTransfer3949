# Security Policy

## Supported Versions

We actively release security patches and updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## 🔒 Security Model & Architecture

DocTransfer incorporates a client-side cryptographic security architecture:

1. **Client-Side Encryption**: Documents can be encrypted in the client's browser before upload using OpenPGP and AES-256-GCM.
2. **Access Control & DRM**: Document links enforce server-side validation, password protection, expiry timers, view quotas, and dynamic forensic watermarking.
3. **Supabase Row-Level Security (RLS)**: Database tables enforce strict Postgres RLS policies preventing unauthorized reads, modifications, or cross-tenant data leaks.

---

## 🚨 Reporting a Vulnerability

The DocTransfer team takes security issues very seriously. We appreciate your efforts to responsibly disclose vulnerabilities to us.

### How to Report:
- **Do NOT file a public issue** on GitHub for sensitive security vulnerabilities.
- Please report vulnerabilities privately via **GitHub Private Vulnerability Reporting** (Security tab -> "Report a vulnerability").
- Alternatively, email the maintainers directly with the subject prefix `[SECURITY VULNERABILITY]`.

### What to Include in Your Report:
- A clear description of the vulnerability and its potential impact.
- Step-by-step instructions to reproduce the issue (including proof-of-concept scripts or curl commands if applicable).
- Impacted versions, browsers, or endpoints.
- Any suggested fixes or mitigations.

### Response Timeline:
- **Initial Response**: Within 48 hours acknowledging receipt of the report.
- **Assessment & Triage**: Within 5 business days detailing validation results and planned fixes.
- **Public Disclosure / Release**: Coordinated with the reporter once a patch has been developed, tested, and released.

---

## 🛡️ Best Practices for Self-Hosters

If you are self-hosting DocTransfer in a production environment:
1. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** to frontend client bundles. It must only be used in protected backend services or Edge Functions.
2. **Enable Row Level Security (RLS)** on all Supabase tables and verify policies using our migration scripts.
3. **Use HTTPS / TLS** on all endpoints to safeguard in-flight traffic.
4. **Rotate JWT secrets and API keys** periodically.
