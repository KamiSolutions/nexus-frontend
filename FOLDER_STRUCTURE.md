# Nexus Frontend - Recommended Folder Structure

> **Note (2026-10-02):** the tree below is a *proposed target structure*, not a description of
> the current repo. Some of it is already true (`app/(auth)/`, `app/(workspace)/`,
> `app/components/RoleProtected.tsx`, real `.env.example`/`app.json`/`README.md`), and some of it
> is aspirational and not yet implemented (`components/modules/*`, path aliases, barrel exports,
> `state/` for Zustand). The legacy flat-route tree this doc's Phase-1 migration path once
> implied ((tabs)/, app/financials/, app/hr/, etc.) has since been fully retired for real — see
> `claude/nexus-portal-plan.md`'s Legacy route retirement section. Read this doc as "where we
> could take the structure next," not "what exists today."

## Current State Analysis

The current folder structure mixes concerns and has files spread across top-level and module-specific folders. This guide proposes an improved structure for a project of this scale.

---

## Recommended Folder Structure

```
nexus-frontend/
│
├── app/                                    # Expo Router app directory (main navigation)
│   ├── (auth)/                             # Auth stack
│   │   ├── _layout.tsx                     # Auth navigation config
│   │   ├── login.tsx                       # Login screen
│   │   └── register.tsx                    # Registration screen (optional)
│   │
│   ├── (tabs)/                             # Tab-based routes
│   │   ├── _layout.tsx                     # Tab navigator config
│   │   ├── _home.tsx                       # Home/dashboard tab
│   │   ├── _explore.tsx                    # Explore tab
│   │   └── _more.tsx                       # More menu tab
│   │
│   ├── financials/                         # Financials module
│   │   ├── _layout.tsx                     # Module navigation
│   │   ├── index.tsx                       # Module home
│   │   ├── requisitions.tsx                # Requisitions list
│   │   ├── requisitions/
│   │   │   ├── _details.tsx                # Detail view
│   │   │   ├── _create.tsx                 # Create new
│   │   │   └── _approve.tsx                # Approval workflow
│   │   ├── approvals.tsx                   # Approvals dashboard
│   │   ├── loans.tsx                       # Loan management
│   │   └── analytics.tsx                   # Financial analytics (future)
│   │
│   ├── hr/                                 # HR module
│   │   ├── _layout.tsx                     # Module navigation
│   │   ├── index.tsx                       # HR home
│   │   ├── leave.tsx                       # Leave requests
│   │   ├── leave/
│   │   │   ├── _request.tsx                # Create leave request
│   │   │   └── _approvals.tsx              # Approve leaves
│   │   ├── contracts.tsx                   # Contracts list
│   │   ├── contracts/
│   │   │   └── _details.tsx                # Contract details
│   │   ├── employees.tsx                   # Employee directory
│   │   └── attendance.tsx                  # Attendance tracking (future)
│   │
│   ├── vehicles/                           # Vehicles module
│   │   ├── _layout.tsx                     # Module navigation
│   │   ├── index.tsx                       # Fleet overview
│   │   ├── [id].tsx                        # Vehicle detail page
│   │   ├── maintenance.tsx                 # Maintenance records
│   │   ├── [id]/
│   │   │   └── _maintenance.tsx            # Maintenance details
│   │   ├── assignments.tsx                 # Vehicle assignments
│   │   └── analytics.tsx                   # Fleet analytics (future)
│   │
│   ├── leases/                             # Leases module
│   │   ├── _layout.tsx                     # Module navigation
│   │   ├── index.tsx                       # Properties portfolio
│   │   ├── [id].tsx                        # Property detail
│   │   ├── [id]/
│   │   │   ├── _payments.tsx               # Payment history
│   │   │   └── _inspections.tsx            # Inspection records
│   │   └── renewals.tsx                    # Upcoming renewals
│   │
│   ├── policies/                           # Policies & Claims module
│   │   ├── _layout.tsx                     # Module navigation
│   │   ├── index.tsx                       # Policies overview
│   │   ├── claims.tsx                      # Claims list
│   │   ├── claims/
│   │   │   ├── _create.tsx                 # Submit claim
│   │   │   └── _details.tsx                # Claim details
│   │   └── [id].tsx                        # Policy details
│   │
│   ├── settings/                           # Settings module (future)
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   └── security.tsx
│   │
│   ├── components/                         # App-level components
│   │   ├── common/
│   │   │   ├── RoleProtected.tsx           # Authorization wrapper
│   │   │   ├── DataTable.tsx               # Reusable table component
│   │   │   ├── EmptyState.tsx              # Empty state display
│   │   │   ├── LoadingSpinner.tsx          # Loading indicator
│   │   │   ├── ErrorBoundary.tsx           # Error handling
│   │   │   ├── Header.tsx                  # Page header
│   │   │   ├── Footer.tsx                  # Page footer
│   │   │   └── Sidebar.tsx                 # Navigation sidebar
│   │   │
│   │   ├── modules/
│   │   │   ├── finance/
│   │   │   │   ├── RequisitionCard.tsx
│   │   │   │   ├── ApprovalWorkflow.tsx
│   │   │   │   └── LoanForm.tsx
│   │   │   ├── hr/
│   │   │   │   ├── LeaveForm.tsx
│   │   │   │   ├── ContractViewer.tsx
│   │   │   │   └── EmployeeCard.tsx
│   │   │   ├── vehicles/
│   │   │   │   ├── VehicleCard.tsx
│   │   │   │   ├── MaintenanceForm.tsx
│   │   │   │   └── MaintenanceHistory.tsx
│   │   │   └── leases/
│   │   │       ├── PropertyCard.tsx
│   │   │       ├── LeaseAgreement.tsx
│   │   │       └── PaymentSchedule.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── FormField.tsx               # Reusable form field
│   │   │   ├── FormGroup.tsx               # Form group wrapper
│   │   │   ├── ValidationError.tsx         # Error display
│   │   │   └── SubmitButton.tsx            # Form submit button
│   │   │
│   │   └── ui/                             # Generic UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       ├── Chip.tsx
│   │       ├── DatePicker.tsx
│   │       └── SearchBar.tsx
│   │
│   ├── _layout.tsx                         # Root layout with sidebar
│   ├── index.tsx                           # Landing/login redirect
│   └── modal.tsx                           # Modal screen (if used)
│
│
├── components/                             # Shared cross-app components
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── external-link.tsx
│   ├── parallax-scroll-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       └── icon-symbol.tsx
│
│
├── hooks/                                  # Custom React hooks
│   ├── index.ts                            # Barrel export
│   ├── useAuth.ts                          # Authentication hook
│   ├── useRole.ts                          # Role-based access
│   ├── useApi.ts                           # API communication
│   ├── useForm.ts                          # Form state management
│   ├── useNotification.ts                  # Toast/notification
│   └── useTheme.ts                         # Theme switching
│
│
├── services/                               # Business logic & API
│   ├── api/
│   │   ├── axiosInstance.ts
│   │   ├── financialApi.ts
│   │   ├── hrApi.ts
│   │   ├── vehiclesApi.ts
│   │   ├── leasesApi.ts
│   │   ├── policiesApi.ts
│   │   └── authApi.ts
│   ├── storage/
│   │   ├── localStorage.ts                 # Device storage
│   │   └── sessionStorage.ts
│   ├── auth/
│   │   ├── authService.ts
│   │   └── tokenManager.ts
│   └── notifications/
│       ├── pushNotifications.ts
│       └── toastService.ts
│
│
├── state/                                  # State management (Redux/Zustand)
│   ├── store.ts                            # Store configuration
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── financialSlice.ts
│   │   ├── hrSlice.ts
│   │   ├── vehicleSlice.ts
│   │   ├── leaseSlice.ts
│   │   ├── policySlice.ts
│   │   └── uiSlice.ts
│   └── types/
│       └── store.ts
│
│
├── types/                                  # TypeScript type definitions
│   ├── index.ts                            # Barrel export
│   ├── user.ts
│   ├── finance.ts
│   ├── hr.ts
│   ├── vehicles.ts
│   ├── leases.ts
│   ├── policies.ts
│   ├── api.ts                              # API response types
│   └── common.ts                           # Common types
│
│
├── constants/                              # App constants
│   ├── colors.ts                           # Color palette (new)
│   ├── theme.ts                            # Theme tokens
│   ├── roles.ts                            # User role definitions
│   ├── strings.ts                          # Localization keys
│   ├── endpoints.ts                        # API endpoints
│   ├── routes.ts                           # Named route constants
│   └── config.ts                           # App configuration
│
│
├── utils/                                  # Utility functions
│   ├── index.ts                            # Barrel export
│   ├── validators.ts                       # Form validation
│   ├── formatters.ts                       # Data formatting
│   ├── date.ts                             # Date utilities
│   ├── currency.ts                         # Currency formatting
│   ├── permission.ts                       # Permission checking
│   ├── errorHandler.ts                     # Error handling
│   └── logger.ts                           # Logging utility
│
│
├── assets/
│   ├── images/                             # icon.png, splash-icon.png, android-icon-*.png,
│   │                                       # plus demo/fixture imagery (vehicles, buildings,
│   │                                       # placeholder tenant logos) — see assets/images/
│   │                                       # on disk for the actual current set
│   ├── fonts/
│   └── lottie/                             # Animation files
│
│
├── .env.example                            # Environment template
├── app.json                                # Expo config (updated)
├── package.json                            # Dependencies (updated)
├── tsconfig.json
├── eslint.config.js
├── README.md                               # Project README
└── FOLDER_STRUCTURE.md                     # This file
```

---

## Migration Path (Phased Implementation)

### Phase 1: Immediate (Prioritize)
1. Create `types/` folder barrel export (`types/index.ts`)
2. Create `constants/roles.ts` and `constants/strings.ts`
3. Move module-specific components to `components/modules/{finance,hr,vehicles,etc}`
4. Create basic `hooks/` folder structure

### Phase 2: Short-term (Next Sprint)
1. Create `services/api/` folder for API calls
2. Add `utils/validators.ts` for form validation
3. Create `utils/formatters.ts` for data formatting
4. Add `components/common/` with DataTable, EmptyState, LoadingSpinner

### Phase 3: Medium-term (Feature Implementation)
1. Introduce state management (Redux/Zustand)
2. Create `services/storage/` for data persistence
3. Add error boundaries and better error handling
4. Implement authentication service in `services/auth/`

### Phase 4: Long-term (Optimization)
1. Add analytics service
2. Implement offline mode
3. Add comprehensive logging
4. PDF report generation utilities

---

## Key Improvements This Structure Provides

### 1. **Scalability**
- Clear separation of concerns
- Easy to add new modules
- Each feature is self-contained

### 2. **Maintainability**
- Centralized types (`/types`)
- Shared logic (`/services`, `/hooks`)
- Reusable UI components (`/components`)

### 3. **Performance**
- Code splitting at module boundaries
- Easy to implement lazy loading
- Tree-shaking friendly exports

### 4. **Developer Experience**
- Discoverable file locations
- Barrel exports reduce import paths
- Clear naming conventions

### 5. **Testing**
- Services can be mocked
- Hooks are testable in isolation
- Components are modular

---

## Import Path Examples

### Before (Current)
```typescript
import { Colors, Fonts } from '../../constants/theme';
import FileUpload from '../components/FileUpload';
// Messy, unclear where things live
```

### After (Recommended)
```typescript
import { Colors, Fonts } from '@constants/theme';
import { useAuth, useApi } from '@hooks';
import { RequisitionCard } from '@components/modules/finance';
import { DataTable, RoleProtected } from '@components/common';
// Clear, maintainable, uses path aliases

// In tsconfig.json:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@assets/*": ["assets/*"],
      "@components/*": ["app/components/*"],
      "@constants/*": ["constants/*"],
      "@hooks/*": ["hooks/*"],
      "@services/*": ["services/*"],
      "@state/*": ["state/*"],
      "@types/*": ["types/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

---

## File Naming Conventions

### Screens (in app/)
- `index.tsx` – Module home/entry point
- `[id].tsx` – Detail/dynamic routes
- `_layout.tsx` – Navigation configuration

### Components
- PascalCase: `RequisitionCard.tsx`, `LeaveForm.tsx`
- Descriptive names that indicate purpose
- Suffix with `Form`, `Card`, `List`, `Dialog` for clarity

### Hooks
- Prefix with `use`: `useAuth.ts`, `useForm.ts`
- Describe what they manage/return

### Services
- Describe domain: `authService.ts`, `financialApi.ts`
- Suffix with `Service` or `Api` for clarity

### Types
- Match domain: `finance.ts`, `hr.ts`, `vehicles.ts`
- Use `interface` for object shapes
- Use `enum` for fixed values

### Utils  
- Functional grouping: `validators.ts`, `formatters.ts`, `date.ts`

---

## Example: Adding a New Module (e.g., Analytics)

```
Recommended addition to app/:
├── analytics/
│   ├── _layout.tsx
│   ├── index.tsx  
│   ├── financial-reports.tsx
│   ├── hr-analytics.tsx
│   └── export.tsx

Recommended components addition:
├── components/modules/analytics/
│   ├── ReportCard.tsx
│   ├── ChartViewer.tsx
│   └── ExportDialog.tsx

Recommended types addition:
├── types/analytics.ts
│   ├── interface Report
│   ├── interface ChartData
│   └── enum ReportType

Recommended services addition:
├── services/api/analyticsApi.ts
```

---

## Benefits Summary

| Aspect | Benefit |
|--------|---------|
| **Onboarding** | New developers understand structure immediately |
| **Feature Addition** | Clear where new code goes |
| **Bug Fixes** | Easy to locate relevant code |
| **Testing** | Modular structure enables unit/integration tests |
| **Performance** | Code splitting at module boundaries |
| **Reusability** | Shared components and utilities |
| **Maintainability** | Clear separation of concerns |
| **Scalability** | Can grow to 100+ screens without issues |

---

## Notes

- This structure supports growth to 10,000+ lines of code
- Follows React Native & Expo best practices
- Aligns with Expo Router file conventions
- Parallels modern mobile app architecture (Flutter, SwiftUI)
- Enables concurrent feature development across teams

---

**Recommendation:** Implement Phase 1 immediately, then gradually migrate to full structure as new features are added.
