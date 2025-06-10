export const all_routes = {
  dasshboard: "/crms/dashboard",

  login: "/crms/login",
  /*Contact-route*/
  contacts: "/crms/contacts",
  contactDetail: "/crms/contacts/:id",
  contactGrid: "/crms/contact-grid",
  /*End Contact Route*/

  leadsDetail: "/crms/leads/:id",
  leads: "/crms/leads",
  leadskanban: "/crms/leads-kanban",

  /* Calls */
  calls: "/crms/calls",

  /*Compnay-route*/
  companies: "/crms/companies",
  companyDetails: "/crms/companies/:id",
  /*End Compnay Route*/

  /* pipeline-route*/
  pipelines: "/crms/pipelines",
  pipelineDetail: "/crms/pipelines/:id",
  /* /pipeline Route */

  /* Deals Route*/
  deals: "/crms/deals",
  dealtDetail: "/crms/deals/:id",
  dealsKanban: "/crms/deals-kanban",
  /* /Deals Route */

  /* Activity Route */
  activityCalls: "/crms/crm/activity-calls",
  activityMail: "/crms/crm/activity-mail",
  activityTask: "/crms/crm/activity-task",
  activityMeeting: "/crms/crm/activity-meeting",
  activities: "/crms/crm/activities",
  //CRM SETTINGS

  /* Source Route*/
  sources: "/crms/sources",
  /* lost reason*/
  lostReason: "/crms/lost-reasons",
  /* contact-stages */
  contactStage: "/crms/contact-stages",
  /* industries */
  industries: "/crms/industries",
  /* call-statuses */
  callStatus: "/crms/call-status",
  callResult: "/crms/call-result",
  callPurpose: "/crms/call-purpose",
  callType: "/crms/call-types",
  /*projects */
  projects: "/crms/projects",
  projectDetails: "/crms/projects/:id",

  state: "/crms/state",
  country: "/crms/country",
  currency: "/crms/currency",


  // Settings //
  connectedApps: "/crms/general-settings/connected-apps",
  notification: "/crms/general-settings/notification",
  profile: "/crms/general-settings/profile",
  security: "/crms/general-settings/security",

  appearance: "/crms/website-settings/appearance",
  companySettings: "/crms/website-settings/company-settings",
  language: "/crms/website-settings/language",
  localization: "/crms/website-settings/localization",
  preference: "/crms/website-settings/preference",
  prefixes: "/crms/website-settings/prefixes",
  languageWeb: "/crms/website-settings/language-web",

  customFields: "/crms/app-settings/custom-fields",
  invoiceSettings: "/crms/app-settings/invoice-settings",
  printers: "/crms/app-settings/printers",


  emailSettings: "/crms/system-settings/storage",
  gdprCookies: "/crms/system-settings/gdpr-cookies",
  smsGateways: "/crms/system-settings/sms-gateways",

  bankAccounts: "/crms/financial-settings/bank-accounts",
  currencies: "/crms/financial-settings/currencies",
  paymentGateways: "/crms/financial-settings/payment-gateways",
  taxRates: "/crms/financial-settings/tax-rates",

  banIpAddrress: "/crms/other-settings/ban-ip-address",
  storage: "/crms/other-settings/storage",


  /* USER MANAGEMENT */
  manageusers: "/crms/manage-users",
  manageusersDetails: "/crms/manage-users/:id",

  rolesPermissions: "/crms/roles-permissions",

  // dashboard routes
  dealsDashboard: "/crms/dashboard/deals-dashboard",
  leadsDashboard: "/crms/dashboard/leads-dashboard",
  projectDashboard: "/crms/dashboard/project-dashboard",

  // Vendor
  vendor: "vendor",
  VendorDetail: "vendor/:id",

  // Meeting
  meetingType:"/crms/meeting-type",
   
  modules:"/crms/modules",
  
  documents:"/crms/documents",
  activityKanban:"/crms/crm/activity-kanban",

  productCategory: "/crms/product-category",
  manufacturer:"/crms/manufacturer",
  products:"/crms/products",
  taxSetUp:"/crms/tax-setup",
  order:"/crms/order",
  quotation:"/crms/quotation",
  purchaseOrder:"/crms/purchase-order",
  salesInvoice:"/crms/sales-invoice",
  purchaseInvoice:"/crms/purchase-invoice",
  priceBook:"/crms/price-book",
  cases:"/crms/cases",
  solutions:"/crms/solutions",
  campaigns:"/crms/campaigns",

  leadReport:"/crms/lead-report",
  dealReport:"/crms/deal-report",
  companyReport:"/crms/company-report",
  contactReport:"/crms/contact-report",
  projectReport:"/crms/project-report",
  taskReport:"/crms/task-report",
  noPermission:"/crms/no-permission",
};
