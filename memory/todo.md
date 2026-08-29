# Refactoring TODO (from code review)

## Priority 1: Quick Wins ✅
- [x] Use `SmartLink` instead of `<Link>` in student module
- [x] Remove duplicate `accent-line` in StudentDashboard, use `src/components/accent-line.tsx`
- [x] Move landing page components from `src/components/` to `src/features/landing/`

## Priority 2: Medium Effort
- [x] Standardize student layout to match other module layouts (AppSidebar + SidebarInset)
- [x] Student sidebar replaced with shared AppSidebar pattern
- [ ] Extract kaleidoscope/canvas code from LoginPage.tsx and ForgotPasswordPage.tsx into shared hook
- [ ] Standardize auth page decoration (all pages same level of polish)
- [ ] Replace custom `Field` component in auth pages with shadcn `Input`/`Label`

## Priority 3: Major Refactor
- [x] Migrate all inline `style={{}}` to Tailwind classes in student module (StudentDashboard, StudentSidebar)
- [x] Implement `react-hook-form` + `zod` for password change form (StudentProfile)
- [ ] Migrate auth pages to react-hook-form + zod
- [ ] Migrate admin/teacher forms to react-hook-form + zod
- [ ] Wire up backend API calls in student module (check with Love what's available)

## Deferred
- [ ] Landing page Tailwind migration (previous attempt failed, rolled back)
- [ ] Auth pages refactor (out of scope per reviewer ownership)
