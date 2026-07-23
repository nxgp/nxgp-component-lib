/**
 * OpenUI Lang fixtures for Storybook demos and tests.
 *
 * Each fixture is authored the way a well-prompted LLM would stream it:
 * `root = Stack(...)` first, one statement per node, POSITIONAL arguments only
 * (no `name: value` — the OpenUI Lang parser does not support colon syntax).
 */

/** Analytics summary — KPI row + trend chart + top-accounts table. */
export const analyticsFixture = `root = Stack([heading, kpis, revenueChart, topTable], "column", "lg")
heading = Text("Q3 performance", "h2")
kpis = Stack([mRevenue, mUsers, mChurn, mNps], "row", "md", "stretch", "start", true)
mRevenue = Metric("Revenue", "$48.2k", "+12%", "vs last quarter", "up")
mUsers = Metric("Active users", "3,140", "+4%", "weekly active", "up")
mChurn = Metric("Churn", "1.8%", "-0.3%", "monthly", "down")
mNps = Metric("NPS", "62", "+5", "promoters minus detractors", "up")
revenueChart = Chart("area", "month", [sRevenue, sExpenses], revenueRows, "Revenue vs expenses")
sRevenue = { key: "revenue", label: "Revenue" }
sExpenses = { key: "expenses", label: "Expenses" }
revenueRows = [{ month: "Apr", revenue: 32, expenses: 21 }, { month: "May", revenue: 38, expenses: 23 }, { month: "Jun", revenue: 41, expenses: 24 }, { month: "Jul", revenue: 48, expenses: 26 }]
topTable = DataTable(topCols, topRows, "Top accounts")
topCols = [{ key: "account", header: "Account" }, { key: "plan", header: "Plan" }, { key: "mrr", header: "MRR" }]
topRows = [{ account: "Acme Inc", plan: "Enterprise", mrr: "$4,200" }, { account: "Globex", plan: "Team", mrr: "$1,800" }, { account: "Initech", plan: "Team", mrr: "$1,450" }, { account: "Umbrella", plan: "Pro", mrr: "$620" }]
`;

/** Listing — restaurant cards with avatar, badges, and a reserve action. */
export const restaurantsFixture = `root = Stack([title, list], "column", "md")
title = Text("Dinner near you", "h2")
list = Stack([c1, c2, c3], "column", "md")
c1 = Card([c1head, c1meta, c1cta], "Bella Trattoria", "Italian - $$ - 0.4 mi")
c1head = Stack([c1avatar, c1badges], "row", "sm", "center")
c1avatar = Avatar("BT")
c1badges = Stack([c1b1, c1b2], "row", "sm")
c1b1 = Badge("4.8 stars", "default")
c1b2 = Badge("Open now", "secondary")
c1meta = Text("Wood-fired pizza and house-made pasta with patio seating.", "muted")
c1cta = Button("Reserve at Bella Trattoria", "Reserve a table at Bella Trattoria", "default")
c2 = Card([c2head, c2meta, c2cta], "Sakura Izakaya", "Japanese - $$$ - 0.7 mi")
c2head = Stack([c2avatar, c2badges], "row", "sm", "center")
c2avatar = Avatar("SI")
c2badges = Stack([c2b1, c2b2], "row", "sm")
c2b1 = Badge("4.6 stars", "default")
c2b2 = Badge("2 tables left", "outline")
c2meta = Text("Charcoal-grilled skewers and an extensive sake list.", "muted")
c2cta = Button("Reserve at Sakura Izakaya", "Reserve a table at Sakura Izakaya", "default")
c3 = Card([c3head, c3meta, c3cta], "Verde Cantina", "Mexican - $$ - 1.1 mi")
c3head = Stack([c3avatar, c3badges], "row", "sm", "center")
c3avatar = Avatar("VC")
c3badges = Stack([c3b1, c3b2], "row", "sm")
c3b1 = Badge("4.7 stars", "default")
c3b2 = Badge("Open now", "secondary")
c3meta = Text("Seasonal tacos and mezcal cocktails in a lively room.", "muted")
c3cta = Button("Reserve at Verde Cantina", "Reserve a table at Verde Cantina", "default")
`;

/** Approval — workflow stepper + spend chart + line items + approve/reject. */
export const approvalFixture = `root = Stack([head, note, steps, spendChart, lineItems, actions], "column", "lg")
head = Text("Expense report #4821", "h2")
note = Alert("Awaiting your review", "Submitted by Priya Shah on Jul 14 - $2,480 total.", "info")
steps = Stepper(stepList, "review")
stepList = [{ id: "submitted", label: "Submitted" }, { id: "review", label: "In review" }, { id: "approved", label: "Approved" }]
spendChart = Chart("bar", "category", [sAmount], spendRows, "Spend by category")
sAmount = { key: "amount", label: "Amount" }
spendRows = [{ category: "Flights", amount: 940 }, { category: "Hotel", amount: 820 }, { category: "Meals", amount: 430 }, { category: "Transit", amount: 290 }]
lineItems = DataTable(liCols, liRows, "Line items")
liCols = [{ key: "date", header: "Date" }, { key: "vendor", header: "Vendor" }, { key: "amount", header: "Amount" }]
liRows = [{ date: "Jul 10", vendor: "United Airlines", amount: "$940" }, { date: "Jul 10", vendor: "Hyatt", amount: "$820" }, { date: "Jul 11", vendor: "Blue Bottle", amount: "$68" }, { date: "Jul 12", vendor: "Uber", amount: "$290" }]
actions = Buttons([bApprove, bReject], "row")
bApprove = Button("Approve", "Approve expense report #4821", "default")
bReject = Button("Reject", "Reject expense report #4821", "destructive")
`;

/** Comparison — pricing plans split across tabs, each tab a row of cards. */
export const plansFixture = `root = Stack([title, tabs], "column", "md")
title = Text("Choose a plan", "h2")
tabs = Tabs([tabMonthly, tabYearly])
tabMonthly = { value: "monthly", label: "Monthly", content: [monthlyRow] }
tabYearly = { value: "yearly", label: "Yearly (save 20%)", content: [yearlyRow] }
monthlyRow = Stack([pmPro, pmTeam], "row", "md", "stretch", "start", true)
pmPro = Card([pmProPrice, pmProDesc, pmProCta], "Pro", "For individuals")
pmProPrice = Metric("Per month", "$29", "", "billed monthly", "flat")
pmProDesc = Text("Unlimited projects, 30-day history, email support.", "muted")
pmProCta = Button("Choose Pro monthly", "Choose the Pro monthly plan", "outline")
pmTeam = Card([pmTeamPrice, pmTeamDesc, pmTeamCta], "Team", "For growing teams")
pmTeamPrice = Metric("Per month", "$99", "", "billed monthly", "flat")
pmTeamDesc = Text("Everything in Pro plus SSO, roles, and priority support.", "muted")
pmTeamCta = Button("Choose Team monthly", "Choose the Team monthly plan", "default")
yearlyRow = Stack([pyPro, pyTeam], "row", "md", "stretch", "start", true)
pyPro = Card([pyProPrice, pyProDesc, pyProCta], "Pro", "For individuals")
pyProPrice = Metric("Per month", "$23", "-20%", "billed yearly", "down")
pyProDesc = Text("Unlimited projects, 30-day history, email support.", "muted")
pyProCta = Button("Choose Pro yearly", "Choose the Pro yearly plan", "outline")
pyTeam = Card([pyTeamPrice, pyTeamDesc, pyTeamCta], "Team", "For growing teams")
pyTeamPrice = Metric("Per month", "$79", "-20%", "billed yearly", "down")
pyTeamDesc = Text("Everything in Pro plus SSO, roles, and priority support.", "muted")
pyTeamCta = Button("Choose Team yearly", "Choose the Team yearly plan", "default")
`;

/** Form — a demo booking form with mixed field types + submit. */
export const bookingFixture = `root = Stack([title, intro, form], "column", "md")
title = Text("Book a demo", "h2")
intro = Text("Tell us a bit about you and we'll tailor the walkthrough.", "muted")
form = Form("demo", [fcName, fcEmail, fcDate, fcTeam, fcNotes], [submit])
fcName = FormControl("Full name", inName)
inName = Input("name", "Ada Lovelace")
fcEmail = FormControl("Work email", inEmail, "We'll only use this to confirm the demo.")
inEmail = Input("email", "ada@example.com", "email")
fcDate = FormControl("Preferred date", inDate)
inDate = DateInput("date")
fcTeam = FormControl("Team size", inTeam)
inTeam = Select("team", teamOpts, "Select team size")
teamOpts = [{ value: "1-10", label: "1-10" }, { value: "11-50", label: "11-50" }, { value: "51+", label: "51+" }]
fcNotes = FormControl("Anything else?", inNotes)
inNotes = TextArea("notes", "What would you like to see?")
submit = Button("Request demo", "Submit the demo request", "default")
`;

/** All fixtures keyed by id, for the Storybook fixture switcher. */
export const openUIFixtures = {
  analytics: { label: "Analytics", source: analyticsFixture },
  restaurants: { label: "Restaurant listing", source: restaurantsFixture },
  approval: { label: "Approval workflow", source: approvalFixture },
  plans: { label: "Plan comparison", source: plansFixture },
  booking: { label: "Booking form", source: bookingFixture },
} as const;

/** Fixture id union. */
export type OpenUIFixtureId = keyof typeof openUIFixtures;
