# Hotel Front Office Dashboard Plan

## UI/UX Design
- **Style**: Minimalist with Glassmorphism highlights.
- **Palette**:
  - Primary: Indigo-600 (Trust)
  - Occupied: Indigo-500
  - Vacant-Clean: Emerald-500
  - Vacant-Dirty: Amber-500
  - Out-of-Order: Rose-500
- **Typography**: Inter (Modern, Clean).

## Core Components
1. **Layout**: Sidebar with active links, Header with search and profile.
2. **Dashboard Overview**:
   - StatsCards: Arrivals (Inbound), Departures (Outbound), Stay-overs (Ongoing), Occupancy % (Circular Progress).
   - Quick Search: Functional search bar filtering the Room Grid.
3. **Room Status Grid**:
   - Interactive grid showing 20+ rooms.
   - Each card displays Room Number, Type (Deluxe, Suite, Standard), and Guest info if occupied.
   - Actions: 'Check-In' (for Vacant-Clean) and 'Check-Out' (for Occupied).
4. **Modals**:
   - Check-In: Simple form with Guest Name, Email, Stay Duration.
   - Check-Out: Confirmation with bill summary.
5. **Notifications**: Real-time feedback via `sonner`.

## Technical Strategy
- State management for rooms and guests using `useState`.
- Framer Motion for room status transitions and grid loading.
- Lucide React for meaningful icons.
- Shadcn UI for basic components (Button, Input, Badge, Dialog).
