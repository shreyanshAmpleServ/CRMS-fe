import { all_routes } from "../../../../routes/all_routes";
const route = all_routes;
const isRedirectional = localStorage.getItem("redirectLogin");
export const SidebarData = [
  {
    label: "CRM",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "crm",
    submenuItems: [
      {
        label: "Dashboard",
        link: route.dasshboard,
        icon: "ti ti-layout-dashboard",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Dashboard",
            link: route.dasshboard,
            icon: "ti ti-layout-dashboard",
            showSubRoute: true,
          },
          {
            label: "Lead Dashboard",
            link: route.leadsDashboard,
            icon: "ti ti-layout-dashboard",
            showSubRoute: false,
          },
        ],
      },
      // {
      //   label: "Dashboard",
      //   link: route.dasshboard,
      //   icon: "ti ti-layout-dashboard",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Lead Dashboard",
      //   link: route.leadsDashboard,
      //   icon: "ti ti-layout-dashboard",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      {
        label: "Leads",
        link: route.leads,
        subLink1: route.leadsDetail,
        subLink2: route.leadskanban,
        icon: "ti ti-chart-arcs",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Contacts",
        link: route.contacts,
        subLink1: route.contactDetail,
        subLink2: route.contactGrid,
        icon: "ti ti-user-up",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Companies",
        link: route.companies,
        subLink1: route.companyDetails,
        subLink2: route.companiesGrid,
        icon: "ti ti-building-community",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Deals",
        link: route.deals,
        subLink1: route.dealtDetail,
        subLink2: route.dealsKanban,
        icon: "ti ti-medal",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Activities",
        link: route.activities,
        subLink1: `${route.activities}/Task`,
        subLink2: route.activityTask,
        subLink3: route.activityMail,
        subLink4: route.activityCalls,
        icon: "ti ti-bounce-right",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Calls",
        link: route.calls,
        // subLink1: route.dealtDetail,
        // subLink2: route.dealsKanban,
        icon: "ti ti-phone",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Campaigns",
        link: route.campaigns,
        // subLink1: route.dealtDetail,
        // subLink2: route.dealsKanban,
        icon: "ti ti-sitemap",
        showSubRoute: false,
        submenu: false,
      },

      {
        label: "Pipeline",
        link: route.pipelines,
        subLink1: route.pipelineDetail,
        subLink2: route.pipelineGrid,
        icon: "ti ti-timeline-event-exclamation",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Documents",
        link: route.documents,
        icon: "ti ti-file-type-doc",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Projects",
        link: route.projects,
        subLink1: route.projectDetails,
        icon: "ti ti-atom-2",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Quotation",
        link: route.quotation,
        icon: "ti ti-clipboard-text",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Orders",
        link: route.order,
        // subLink1: route.projectDetails,
        icon: "ti ti-truck-delivery",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Sales Invoice",
        link: route.salesInvoice,
        // subLink1: route.projectDetails,
        icon: "ti ti-file-invoice",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Purchase Order",
        link: route.purchaseOrder,
        icon: "ti ti-truck-delivery",
        showSubRoute: false,
        submenu: false,
      },

      // {
      //   label: "Purchase Invoice",
      //   link: route.purchaseInvoice,
      //   // subLink1: route.projectDetails,
      //   icon: "ti ti-file-invoice",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      {
        label: "Reports",
        link: route.leadReport,
        icon: "ti ti-file-invoice",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Lead Reports",
            link: route.leadReport,
            icon: "ti ti-phone-check",
            showSubRoute: true,
          },
          {
            label: "Deal Reports",
            link: route.dealReport,
            showSubRoute: false,
          },
          {
            label: "Contact Reports",
            link: route.contactReport,
            showSubRoute: false,
          },
          {
            label: "Company Reports",
            link: route.companyReport,
            showSubRoute: false,
          },
          {
            label: "Project Reports",
            link: route.projectReport,
            showSubRoute: false,
          },
          {
            label: "Task Reports",
            link: route.taskReport,
            showSubRoute: false,
          },
        ],
      },
    ],
  },
  {
    label: "CRM SETTINGS",
    submenuOpen: true,
    submenuHdr: "Sales",
    submenu: false,
    showSubRoute: false,
    submenuItems: [
      {
        label: "Vendor",
        link: route.vendor,
        icon: "ti ti-user-filled",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Products",
        link: route.products,
        icon: "ti ti-sitemap",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Price Book",
        link: route.priceBook,
        icon: "ti ti-clipboard-text",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Cases",
        link: route.cases,
        icon: "ti ti-coin",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Solutions",
        link: route.solutions,
        icon: "ti ti-notes",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Sources",
        link: route.sources,
        icon: "ti ti-artboard",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Lead Status",
        link: route.lostReason,
        icon: "ti ti-message-exclamation",
        showSubRoute: false,
        submenu: false,
      },

      {
        label: "Contact Stage",
        link: route.contactStage,
        icon: "ti ti-steam",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Industry",
        link: route.industries,
        icon: "ti ti-building-factory",
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Call",
        link: route.callStatus,
        icon: "ti ti-phone-check",
        showSubRoute: false,
        submenu: true,
        submenuItems: [
          {
            label: "Call Status",
            link: route.callStatus,
            icon: "ti ti-phone-check",
            showSubRoute: true,
          },
          {
            label: "Call Purpose",
            link: route.callPurpose,
            showSubRoute: false,
          },
          {
            label: "Call Result",
            link: route.callResult,
            showSubRoute: false,
          },
          {
            label: "Call Types",
            link: route.callType,
            showSubRoute: false,
          },
        ],
      },
      {
        label: "Meeting Types",
        link: route.meetingType,
        icon: "ti ti-calendar-time", // Icon for Country
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Product Category",
        link: route.productCategory,
        icon: "ti ti-category", // Icon for Country
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Manufacturer",
        link: route.manufacturer,
        icon: "ti ti-building-factory", // Icon for Country
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Tax Setup",
        link: route.taxSetUp,
        icon: "ti ti-receipt-tax", // Icon for Country
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Country",
        link: route.country,
        icon: "ti ti-globe", // Icon for Country
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "State",
        link: route.state,
        icon: "ti ti-map-pin", // Icon for State
        showSubRoute: false,
        submenu: false,
      },

      {
        label: "Currency",
        link: route.currency,
        icon: "ti ti-wallet", // Updated icon for Currency
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Modules",
        link: route.modules,
        icon: "ti ti-align-box-left-middle", // Updated icon for Currency
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  // {
  //   label: "Reports",
  //   submenuOpen: true,
  //   submenuHdr: "reports",
  //   submenu: false,
  //   showSubRoute: false,
  //   submenuItems: [
  //     {
  //       label: "Reports",
  //       link: route.leadReport,
  //       icon: "ti ti-file-invoice",
  //       showSubRoute: false,
  //       submenu: false,
  //       submenuItems: [
  //         {
  //           label: "Lead Reports",
  //           link: route.leadReport,
  //           icon: "ti ti-phone-check",
  //           showSubRoute: true,
  //         },
  //         {
  //           label: "Deal Reports",
  //           link: route.dealReport,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Contact Reports",
  //           link: route.contactReport,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Company Reports",
  //           link: route.companyReport,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Project Reports",
  //           link: route.projectReport,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Task Reports",
  //           link: route.taskReport,
  //           showSubRoute: false,
  //         },
  //       ]
  //     },

  //   ],
  // },
  ...(!isRedirectional
    ? [
        {
          label: "USER MANAGEMENT",
          submenuOpen: true,
          submenuHdr: "Sales",
          submenu: false,
          showSubRoute: false,
          submenuItems: [
            {
              label: "Manage Users",
              link: route.manageusers,
              icon: "ti ti-file-invoice",
              showSubRoute: false,
              submenu: false,
            },
            {
              label: "Roles & Permission",
              link: route.rolesPermissions,
              icon: "ti ti-navigation-cog",
              showSubRoute: false,
              submenu: false,
            },
          ],
        },
      ]
    : []),

  // {
  //   label: "Settings",
  //   submenu: true,
  //   showSubRoute: false,
  //   submenuHdr: "Settings",
  //   submenuItems: [
  //     {
  //       label: "General Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-settings-cog",
  //       submenuItems: [
  //         { label: "Profile", link: route.profile },
  //         { label: "Security", link: route.security },
  //         { label: "Notifications", link: route.notification },
  //         { label: "Connected Apps", link: route.connectedApps },
  //       ],
  //     },
  //     {
  //       label: "Website Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-world-cog",
  //       submenuItems: [
  //         {
  //           label: "Company Settings",
  //           link: route.companySettings,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Localization",
  //           link: route.localization,
  //           showSubRoute: false,
  //         },
  //         { label: "Prefixes", link: route.prefixes, showSubRoute: false },
  //         { label: "Preference", link: route.preference, showSubRoute: false },
  //         { label: "Appearance", link: route.appearance, showSubRoute: false },
  //         {
  //           label: "Language",
  //           link: route.language,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "App Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-apps",
  //       submenuItems: [
  //         {
  //           label: "Invoice",
  //           link: route.invoiceSettings,
  //           showSubRoute: false,
  //         },
  //         { label: "Printer", link: route.printers, showSubRoute: false },
  //         {
  //           label: "Custom Fields",
  //           link: route.customFields,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "System Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-device-laptop",
  //       submenuItems: [
  //         { label: "Email", link: route.emailSettings, showSubRoute: false },
  //         {
  //           label: "SMS Gateways",
  //           link: route.smsGateways,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "GDPR Cookies",
  //           link: route.gdprCookies,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Financial Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-moneybag",
  //       submenuItems: [
  //         {
  //           label: "Payment Gateway",
  //           link: route.paymentGateways,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Bank Accounts",
  //           link: route.bankAccounts,
  //           showSubRoute: false,
  //         },
  //         { label: "Tax Rates", link: route.taxRates, showSubRoute: false },
  //         {
  //           label: "Currencies",
  //           link: route.currencies,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Other Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-flag-cog",
  //       submenuItems: [
  //         { label: "Storage", link: route.storage, showSubRoute: false },
  //         {
  //           label: "Ban IP Address",
  //           link: route.banIpAddrress,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //   ],
  // },
];
