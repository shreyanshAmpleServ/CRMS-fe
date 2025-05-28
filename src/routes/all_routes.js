export const all_routes = {
  dasshboard: "/dashboard",

  login: "/login",
  /*Contact-route*/
  contacts: "/contacts",
  contactDetail: "/contacts/:id",
  contactGrid: "/contact-grid",
  /*End Contact Route*/

  leadsDetail: "/leads/:id",
  leads: "/leads",
  leadskanban: "/leads-kanban",

  /* Calls */
  calls: "/calls",

  /*Compnay-route*/
  companies: "/companies",
  companyDetails: "/companies/:id",
  /*End Compnay Route*/

  /* pipeline-route*/
  pipelines: "/pipelines",
  pipelineDetail: "/pipelines/:id",
  /* /pipeline Route */

  /* Deals Route*/
  deals: "/deals",
  dealtDetail: "/deals/:id",
  dealsKanban: "/deals-kanban",
  /* /Deals Route */

  /* Activity Route */
  activityCalls: "/crm/activity-calls",
  activityMail: "/crm/activity-mail",
  activityTask: "/crm/activity-task",
  activityMeeting: "/crm/activity-meeting",
  activities: "/crm/activities",
  //CRM SETTINGS

  /* Source Route*/
  sources: "/sources",
  /* lost reason*/
  lostReason: "/lost-reasons",
  /* contact-stages */
  contactStage: "/contact-stages",
  /* industries */
  industries: "/industries",
  /* call-statuses */
  callStatus: "/call-status",
  callResult: "/call-result",
  callPurpose: "/call-purpose",
  callType: "/call-types",
  /*projects */
  projects: "/projects",
  projectDetails: "/projects/:id",

  state: "/state",
  country: "/country",
  currency: "/currency",


  // Settings //
  connectedApps: "/general-settings/connected-apps",
  notification: "/general-settings/notification",
  profile: "/general-settings/profile",
  security: "/general-settings/security",

  appearance: "/website-settings/appearance",
  companySettings: "/website-settings/company-settings",
  language: "/website-settings/language",
  localization: "/website-settings/localization",
  preference: "/website-settings/preference",
  prefixes: "/website-settings/prefixes",
  languageWeb: "/website-settings/language-web",

  customFields: "/app-settings/custom-fields",
  invoiceSettings: "/app-settings/invoice-settings",
  printers: "/app-settings/printers",


  emailSettings: "/system-settings/storage",
  gdprCookies: "/system-settings/gdpr-cookies",
  smsGateways: "/system-settings/sms-gateways",

  bankAccounts: "/financial-settings/bank-accounts",
  currencies: "/financial-settings/currencies",
  paymentGateways: "/financial-settings/payment-gateways",
  taxRates: "/financial-settings/tax-rates",

  banIpAddrress: "/other-settings/ban-ip-address",
  storage: "/other-settings/storage",


  /* USER MANAGEMENT */
  manageusers: "/manage-users",
  manageusersDetails: "/manage-users/:id",

  rolesPermissions: "/roles-permissions",

  // dashboard routes
  dealsDashboard: "/dashboard/deals-dashboard",
  leadsDashboard: "/dashboard/leads-dashboard",
  projectDashboard: "/dashboard/project-dashboard",

  // Vendor
  vendor: "vendor",
  VendorDetail: "vendor/:id",

  // Meeting
  meetingType:"/meeting-type",
   
  modules:"/modules",
  
  documents:"/documents",
  activityKanban:"/crm/activity-kanban",

  productCategory: "/product-category",
  manufacturer:"/manufacturer",
  products:"/products",
  taxSetUp:"/tax-setup",
  order:"/order",
  quotation:"/quotation",
  purchaseOrder:"/purchase-order",
  salesInvoice:"/sales-invoice",
  purchaseInvoice:"/purchase-invoice",
  priceBook:"/price-book",
  cases:"/cases",
  solutions:"/solutions",
  campaigns:"/campaigns",

  leadReport:"/lead-report",
  dealReport:"/deal-report",
  companyReport:"/company-report",
  contactReport:"/contact-report",
  projectReport:"/project-report",
  taskReport:"/task-report",
  noPermission:"/no-permission",
};
