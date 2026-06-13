# Admin Dashboard Guide

## Overview

The Admin Dashboard provides comprehensive analytics and reporting for NDIS Service Provider operations. It's exclusively available to users with **Admin** role and offers real-time insights into participant management, onboarding progress, and service agreement metrics.

## Accessing the Dashboard

### From Dashboard Page
1. Log in with an **Admin account**
2. Go to the main **Dashboard** page
3. Click the **"Admin Dashboard"** button (purple) in the top-right corner
4. Or navigate directly to: `/admin/dashboard`

## Dashboard Sections

### 1. Key Metrics (Top Row - 6 Cards)

#### Total Participants
- **Metric:** Total count of registered participants
- **Icon:** Blue person icon
- **Use Case:** Track overall participant base growth

#### Onboarding Completion
- **Metric:** Percentage of participants with completed onboarding
- **Sub-text:** Shows "X of Y completed"
- **Icon:** Green checkmark
- **Calculation:** `(Total Onboarded / Total Participants) × 100%`
- **Use Case:** Monitor onboarding pipeline efficiency

#### Pending Agreements
- **Metric:** Count of service agreements awaiting finalization
- **Sub-text:** Shows completion percentage
- **Icon:** Yellow document
- **Calculation:** `(Completed / (Completed + Pending)) × 100%`
- **Use Case:** Identify agreements needing attention

#### In-Progress Onboarding
- **Metric:** Count of participants currently in onboarding process
- **Icon:** Purple lightning bolt
- **Use Case:** Track active onboarding sessions

#### Completed Agreements
- **Metric:** Count of finalized service agreements
- **Icon:** Indigo dollar sign
- **Use Case:** Track agreement completion rate

#### Coordinator Managed
- **Metric:** Count of participants managed by Support Coordinator
- **Sub-text:** Shows planner-managed count
- **Icon:** Cyan people icon
- **Use Case:** Understand plan management distribution

### 2. Service Type Breakdown (Pie Chart)

**Chart Type:** Pie Chart
**Data:** Distribution of service types across all participants

**Service Types:**
- **SIL - Group Home** - Supported Independent Living in group setting
- **SIL + CP** - SIL with Capacity Building support
- **In-Home Care** - In-home support services
- **Day Program** - Day program participation
- **Unassigned** - Participants without assigned service type

**Use Cases:**
- Understand service type distribution
- Identify resource allocation needs
- Spot underutilized service categories

### 3. Plan Management (Doughnut Chart)

**Chart Type:** Doughnut Chart
**Data:** Split between Coordinator-managed and Planner-managed participants

**Categories:**
- **Coordinator** (Blue) - Support Coordinator manages the plan
- **Planner** (Light Blue) - NDIS Planner manages the plan
- **Unassigned** (Gray) - Not yet assigned to a plan manager

**Use Cases:**
- Monitor plan management distribution
- Identify participants needing plan assignment
- Track coordinator vs. planner workload

### 4. Onboarding Trend (Line Chart)

**Chart Type:** Line Chart
**Time Period:** Last 8 weeks
**Y-Axis:** Number of completed onboardings
**X-Axis:** Week dates

**Use Cases:**
- Track onboarding velocity over time
- Identify trends (increasing/decreasing)
- Spot seasonal patterns
- Monitor process improvements

### 5. Recent Participants (Table)

**Columns:**
| Name | Status | Date |
|------|--------|------|
| Full name | Onboarding status | Registration date |

**Status Badges:**
- 🟢 **Completed** - Onboarding finished
- 🟡 **In Progress** - Actively onboarding
- ⚪ **Pending** - Not yet started

**Quick Actions:**
- "View All Participants →" link at bottom
- Click to navigate to full participant list

**Use Cases:**
- Quick check of newest registrations
- Spot onboarding status of recent additions
- Monitor new participant flow

### 6. Recent Agreements (Table)

**Columns:**
| Participant | Start Date | Created |
|------------|------------|---------|
| Participant name | Agreement start date | Agreement creation date |

**Quick Actions:**
- "View All Agreements →" link at bottom
- Click to navigate to full agreements list

**Use Cases:**
- Track recent agreement generation
- Verify agreement dates are correct
- Identify agreements needing follow-up

## Data Refresh

- Dashboard loads metrics on page open
- All data is **real-time** - calculated from current database state
- Charts and tables update automatically
- No manual refresh button needed
- Hard refresh browser (Ctrl+F5) for immediate cache clear

## Metrics Calculations

### Onboarding Completion Rate
```
= (Participants with completed onboarding / Total participants) × 100%
= Uses latest onboarding record per participant
```

### Agreement Completion Rate
```
= (Completed agreements / Total agreements) × 100%
= Minimum 1 to avoid division by zero
```

### Service Type Breakdown
```
= Count of unique participants per service type
= Uses most recent onboarding record per participant
= Excludes unassigned if service_type is NULL
```

### Plan Management Distribution
```
Coordinator = Count with plan_management = 'coordinator'
Planner = Count with plan_management = 'planner'
Unassigned = Total - Coordinator - Planner
```

## Common Use Cases

### 1. Monitor Onboarding Pipeline
1. Check "Onboarding Completion" percentage
2. Review "In-Progress Onboarding" count
3. View "Recent Participants" table for current progress
4. Use "Onboarding Trend" to spot patterns

### 2. Identify Bottlenecks
- High "Pending Agreements" count = Document generation delay
- High "In-Progress Onboarding" = Slow progression through steps
- Flat "Onboarding Trend" = Decreased momentum

### 3. Plan Capacity
1. Check service type distribution (pie chart)
2. Review plan management split (doughnut chart)
3. Identify underutilized services
4. Plan resource allocation

### 4. Audit Compliance
1. Verify "Total Participants" matches records
2. Check "Completed Agreements" coverage
3. Review "Recent Participants" for timely onboarding
4. Ensure plan management assignment

### 5. Performance Reporting
- Use metrics for stakeholder updates
- Compare trends month-to-month
- Identify operational improvements needed
- Track KPI progress

## Role-Based Access

| User Type | Dashboard Access | Metrics Visible |
|-----------|------------------|-----------------|
| Admin | ✅ Full Access | All metrics |
| Support Worker | ❌ Not Available | N/A |
| Public | ❌ Not Available | N/A |

## Technical Details

### API Endpoint
```
GET /api/dashboard/metrics
Authorization: Bearer {token}
Role Required: admin
Response: DashboardMetrics object
```

### Data Sources
- `participants` table - Total and recent participants
- `onboarding_records` table - Onboarding status and service types
- `service_agreements` table - Agreement counts and dates
- All queries use database indexes for performance

### Performance
- Queries are optimized with indexes
- Calculations run server-side
- Average load time: <500ms
- No client-side calculations

## Troubleshooting

### Dashboard Shows "No Data"
1. Verify you're logged in as Admin
2. Check database connection status
3. Create test participant and onboarding record
4. Hard refresh browser (Ctrl+F5)

### Metrics Appear Incorrect
1. Verify data in database directly
2. Check `onboarding_records` has correct `status` values
3. Ensure `service_agreements` status is set correctly
4. Check participant creation dates are accurate

### Charts Not Rendering
1. Ensure chart.js and react-chartjs-2 are installed
2. Check browser console for errors
3. Verify data is not empty (at least 1 record needed)
4. Hard refresh page

### Slow Loading
1. Check database query performance
2. Verify network connection speed
3. Look for long-running dashboard metrics query
4. Consider database optimization if >100k participants

## Future Enhancements

- [ ] Export dashboard as PDF
- [ ] Email dashboard report (daily/weekly)
- [ ] Custom date range filtering
- [ ] Drill-down into specific service types
- [ ] Support worker assignment analytics
- [ ] Document checklist completion rates
- [ ] Participant satisfaction metrics
- [ ] Cost per agreement metrics
- [ ] Time-to-completion analytics
- [ ] Automated alerts for bottlenecks

## FAQ

**Q: Why can't support workers see the admin dashboard?**
A: Support workers manage day-to-day participant care. The admin dashboard is for operational oversight and strategic planning.

**Q: How often does data update?**
A: Data updates in real-time. Refresh the page to see latest metrics.

**Q: Can I export the dashboard data?**
A: Not yet - this is planned for a future release. Currently, you can take screenshots or use browser dev tools.

**Q: Why is my service type breakdown different than expected?**
A: The dashboard uses the latest onboarding record per participant. If a participant has multiple onboarding records, the most recent determines their service type.

**Q: Can I filter dashboard by date range?**
A: Not currently. The dashboard shows all-time metrics plus weekly/monthly trends for the last 8 weeks and 6 months respectively.

**Q: What if I need participant-level details?**
A: Click "View All Participants" or "View All Agreements" to access detailed tables with filtering and sorting options.
