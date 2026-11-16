# Master login activation — NaTIS admin prototype

Approved email (stored in protected Supabase configuration): `adriaanloggenberg@gmail.com`.

Supabase project: [CHOVHA / repurposed NaTIS backend](https://supabase.com/dashboard/project/cinpqzwltwmuzqjpazju). The project is **not an official NaTIS or RTMC service**.

## Server configuration (completed)
- The `natis_private.master_identity` table contains exactly one approved email.
- After an Auth user with that email **verifies ownership of the mailbox**, a trigger records their UUID in the singleton `natis_private.master_admin` table.
- `public.natis_is_master()` verifies the current authenticated UUID, verified email, approved email and absence of an active ban.
- All NaTIS application tables and client photo storage enforce row-level policies requiring `natis_is_master()`.
- No real citizen data or seed data was inserted. The site does not connect to any official government database.
- No Supabase Auth account has been created as of the configuration check; a **real end-to-end login test remains pending**.

## Finish account activation in the Supabase dashboard

1. **Deploy** `natis-admin/` to an approved HTTPS address first. A GitHub source link is not a deployment.
2. In Supabase, open **Authentication → URL Configuration**. Set the **Site URL** to that HTTPS address and add the precise HTTPS page URL to the **Redirect URLs** allowlist. Avoid broad wildcard redirect URLs.
3. In **Authentication → Users**, choose **Add user → Send invitation**, address it to the approved email. This is a privileged administrator action: do not put a service-role key into web code.
4. The mailbox owner must open the invitation and complete email confirmation at the configured approved address. This automatically populates the master allowlist. Invitations must originate from Supabase and follow the configured redirect.
5. Once signed in, open **Settings → Master administrator password** to choose a unique strong password (12 or more characters). Do not send it in chat.
6. In **Authentication → Providers → Email** disable public registration / new signups when onboarding is complete. If the option is placed elsewhere in a newer UI, locate it under Auth configuration. Keep password sign-in active for the approved user.
7. Retest: the approved user can sign in and read empty NaTIS tables; an unapproved, unverified or signed-out user must be denied; test session sign-out, password change and login links. Verify no real citizen records are present.

The website additionally offers an **Email me a secure sign-in link** option for an **existing** account only. It never auto-creates users (`shouldCreateUser:false`) and requires an HTTPS deployment; redirect URL configuration is mandatory. The initial invitation must be completed first.

## Confirm database state (read-only)

```sql
select email from natis_private.master_identity;
select u.id,u.email,u.email_confirmed_at,m.granted_at
from auth.users u left join natis_private.master_admin m on m.user_id=u.id;
select public.natis_is_master();
```

**Security note:** the last SQL function call made as a database owner will return false; a true result requires the signed-in user's JWT. The Public `natis_is_master()` function is a deliberately narrow boolean-check SECURITY DEFINER RPC and may still be flagged by Supabase Security Advisor. Review that function before production release. Do not use personal/medical/identity data in the prototype until you have written authorisation and a POPIA security review.
