import { Navigate, Route } from "react-router";
import Dashboard from "../pages/main-menu/deals-dashboard";
import { all_routes } from "./all_routes";

import ContactDetail from "../pages/contacts/";
import ContactList from "../pages/contacts/contactList";

import LeadsList from "../pages/leads";
import LeadsDetail from "../pages/leads/LeadsDetail";
import LeadsKanban from "../pages/leads/LeadsKanban";

import Companies from "../pages/companies/";
import CompanyDetail from "../pages/companies/CompanyDetail";

import Pipelines from "../pages/pipelines/";
import PipelineDetail from "../pages/pipelines/PipelineDetail";

import Login from "../pages/auth/Login";
import DealList from "../pages/deals";
import DealDetail from "../pages/deals/DealDetail";
import DealsKanban from "../pages/deals/DealsKanban";

//CRM Settings
import ContactStage from "../pages/crm-settings/contact-stages";
import Industries from "../pages/crm-settings/industries";
import LostReason from "../pages/crm-settings/lost-reasons";
import SourceList from "../pages/crm-settings/sources";

import Calls from "../pages/call";
import CallResult from "../pages/crm-settings/callResult";
import CallStatus from "../pages/crm-settings/calls";
import CallPurpose from "../pages/crm-settings/callsPurpose";
import CallType from "../pages/crm-settings/callType";

import ProjectDetail from "../pages/projects/ProjectsDetail";

import Projects from "../pages/projects";

import CountriesList from "../pages/crm-settings/country";
import CurrencyList from "../pages/crm-settings/currency";
import StateList from "../pages/crm-settings/state";

// USER MANAGEMENT 
import Manageusers from "../pages/user-management/manage-users";
import UserDetail from "../pages/user-management/manage-users/UserDetail";

import RolesPermissions from "../pages/user-management/roles";


// SETTINGS //
import ConnectedApps from "../pages/settings/general-settings/ConnectedApp";
import Notifications from "../pages/settings/general-settings/Notifications";
import Profile from "../pages/settings/general-settings/Profile";
import Security from "../pages/settings/general-settings/Security";

import Appearance from "../pages/settings/website-settings/Appearance";
import CompanySettings from "../pages/settings/website-settings/CompanySettings";
import Language from "../pages/settings/website-settings/LanguageWeb";
import Localization from "../pages/settings/website-settings/Localization";
import Preference from "../pages/settings/website-settings/Preference";
import Prefixes from "../pages/settings/website-settings/Prefixes";


import CustomFields from "../pages/settings/app-settings/CustomFields";
import InvoiceSettings from "../pages/settings/app-settings/InvoiceSettings";
import Printers from "../pages/settings/app-settings/Printers";

import EmailSettings from "../pages/settings/system-settings/EmailSettings";
import GdprCookies from "../pages/settings/system-settings/GdprCookies";
import SmsGateways from "../pages/settings/system-settings/SmsGateways";

import BankAccounts from "../pages/settings/financial-settings/BankAccounts";
import Currencies from "../pages/settings/financial-settings/Currencies";
import PaymentGateways from "../pages/settings/financial-settings/PaymentGateways";
import TaxRates from "../pages/settings/financial-settings/TaxRates";

import BanIpAddress from "../pages/settings/other-settings/BanIpAddress";
import Storage from "../pages/settings/other-settings/Storage";


import Activities from "../pages/Activities";
import MeetingTypes from "../pages/crm-settings/meetingType";
import Modules from "../pages/crm-settings/Modules";
import DealsDashboard from "../pages/main-menu/deals-dashboard";
import LeadsDashboard from "../pages/main-menu/leads-dashboard";
import ProjectDashboard from "../pages/main-menu/project-dashboard";
import Vendor from "../pages/Vendor";
import VendorDetail from "../pages/Vendor/VendorDetail";

import ActivitiesKanban from "../pages/Activities/ActivitiessKanban";
import ManufacturerList from "../pages/crm-settings/Manufacturer";
import ProductCategory from "../pages/crm-settings/ProductCategory";
import Documents from "../pages/Documents";
import Product from "../pages/Product";
import TaxSetUpList from "../pages/crm-settings/TaxSetUp";
import Orders from "../pages/Order";
import Quotation from "../pages/Quotation";
import PurchaseOrders from "../pages/purchaseOrder";
import SalesInvoice from "../pages/salesInvoice";
import PurchaseInvoice from "../pages/purchaseInvoice";
import PriceBook from "../pages/priceBooks";
import Cases from "../pages/Case";
import Solutions from "../pages/Solutions";
import CampaignsList from "../pages/Campaign";
import DealReport from "../pages/Reports/DealReport";
import LeadReport from "../pages/Reports/LeadReport";
import ContactReport from "../pages/Reports/ContactReport";
import ProjectReport from "../pages/Reports/ProjectReport";
import CompanyReport from "../pages/Reports/CompanyReport";
import TaskReport from "../pages/Reports/TaskReport";
import NoPermissionPage from "../components/common/noPermission";

// // Export components individually


export { Dashboard, Login };
const route = all_routes;

export const privateRoutes = [
  {
    path: route.dasshboard,
    element: <Dashboard />,
    route: Route,
    title: "Dashboard",
  },
  {
    path: route.leads,
    element: <LeadsList />,
    route: Route,
    title: 'Leads'
  },
  {
    path: route.contacts,
    element: <ContactList />,
    route: Route,
    title: "Contacts",
  },
  {
    path: route.companies,
    element: <Companies />,
    route: Route,
    title: "Companies",
  },
  {
    path: route.deals,
    element: <DealList />,
    route: Route,
    title: "Deals",
  },  
  {
    path: route.activities,
    element: <Activities />,
    route: Route,
    title: 'Activities'
  },
  {
    path:`${route.activities}/:name`,
    element: <Activities />,
    route: Route,
    title: 'Activities'
  },
  {
    path: route.calls,
    element: <Calls />,
    route: Route,
    title: "Calls",
  },
  {
    path: route.campaigns,
    element: <CampaignsList />,
    route: Route,
    title: "Campaign",
  },
  {
    path: route.documents,
    element: <Documents />,
    route: Route,
    title: "Documents",
  },
  {
    path: route.projects,
    element: <Projects />,
    route: Route,
    title: "Projects Listing",
  },
  {
    path: route.quotation,
    element: <Quotation />,
    route: Route,
    title: "Quotation",
  },
  {
    path: route.order,
    element: <Orders />,
    route: Route,
    title: "Orders",
  },
  {
    path: route.salesInvoice,
    element: <SalesInvoice />,
    route: Route,
    title: "Sales Invoice",
  },
  {
    path: route.purchaseOrder,
    element: <PurchaseOrders />,
    route: Route,
    title: "Purchase Order",
  },
  {
    path: route.purchaseInvoice,
    element: <PurchaseInvoice />,
    route: Route,
    title: "Purchase Invoice",
  },
  {
    path: route.pipelines,
    element: <Pipelines />,
    route: Route,
    title: "Pipelines",
  },
  {
    path: route.vendor,
    element: <Vendor />,
    route: Route,
    title: "Vendor",
  },
  {
    path: route.products,
    element: <Product />,
    route: Route,
    title: "Products",
  },
  {
    path: route.priceBook,
    element: <PriceBook />,
    route: Route,
    title: "Price Book",
  },
  {
    path: route.cases,
    element: <Cases />,
    route: Route,
    title: "Cases",
  },
  {
    path: route.solutions,
    element: <Solutions />,
    route: Route,
    title: "Solutions",
  },
  {
    path: route.sources,
    element: <SourceList />,
    route: Route,
    title: "Sources",
  },
  {
    path: route.lostReason,
    element: <LostReason />,
    route: Route,
    title: "Lead Status",
  },
  {
    path: route.contactStage,
    element: <ContactStage />,
    route: Route,
    title: "Contact Stage",
  },
  {
    path: route.industries,
    element: <Industries />,
    route: Route,
    title: "Industry",
  },
  {
    path: route.callStatus,
    element: <CallStatus />,
    route: Route,
    title: "Call Status",
  },
  {
    path: route.meetingType,
    element: <MeetingTypes />,
    route: Route,
    title: "Meeting Type",
  },
  {
    path: route.productCategory,
    element: <ProductCategory />,
    route: Route,
    title: "Product Category",
  },
  {
    path: route.manufacturer,
    element: <ManufacturerList />,
    route: Route,
    title: "Manufacturer",
  },
  
  {
    path: route.taxSetUp,
    element: <TaxSetUpList />,
    route: Route,
    title: "Tax Setup",
  },
  {
    path: route.country,
    element: <CountriesList />,
    route: Route,
    title: "Country",
  },
  {
    path: route.state,
    element: <StateList />,
    route: Route,
    title: "State",
  },
  {
    path: route.currency,
    element: <CurrencyList />,
    route: Route,
    title: "Currency",
  },
  {
    path: route.modules,
    element: <Modules />,
    route: Route,
    title: 'Modules'
  },
  {
    path: route.leadReport,
    element: <LeadReport />,
    route: Route,
    title: 'Leads Report'
  },
  {
    path: route.dealReport,
    element: <DealReport />,
    route: Route,
    title: 'Deals Report'
  },
  {
    path: route.contactReport,
    element: <ContactReport />,
    route: Route,
    title: 'Contacts Report'
  },
  {
    path: route.companyReport,
    element: <CompanyReport />,
    route: Route,
    title: 'Companies Report'
  },
  {
    path: route.projectReport,
    element: <ProjectReport />,
    route: Route,
    title: 'Projects Report'
  },
  {
    path: route.taskReport,
    element: <TaskReport />,
    route: Route,
    title: 'Task Report'
  },
  {
    path: route.manageusers,
    element: <Manageusers />,
    route: Route,
    title: 'Manage Users'
  },
  {
    path: route.rolesPermissions,
    element: <RolesPermissions />,
    route: Route,
    title: 'Roles & Permission'
  },
  {
    path: route.VendorDetail,
    element: <VendorDetail />,
    route: Route,
    title: "Vendor Details",
  },

  {
    path: route.companyDetails,
    element: <CompanyDetail />,
    route: Route,
    title: "Companies Detail",
  },
  {
    path: route.projectDetails,
    element: <ProjectDetail />,
    route: Route,
    title: "Projects Detail",
  },
  {
    path: route.callResult,
    element: <CallResult />,
    route: Route,
    title: "Call Result",
  },
  {
    path: route.callPurpose,
    element: <CallPurpose />,
    route: Route,
    title: "Call Purpose",
  },
  {
    path: route.callType,
    element: <CallType />,
    route: Route,
    title: "Call Type",
  },
  {
    path: route.leadsDetail,
    element: <LeadsDetail />,
    route: Route,
    title: 'Leads Detail'
  },
  {
    path: route.leadskanban,
    element: <LeadsKanban />,
    route: Route,
    title: "Leads Kanban",
  },
  {
    path: route.pipelineDetail,
    element: <PipelineDetail />,
    route: Route,
    title: "Pipelines Detail",
  },
  {
    path: route.contactDetail,
    element: <ContactDetail />,
    route: Route,
    title: "Contacts Detail",
  },
  {
    path: route.manageusersDetails,
    element: <UserDetail />,
    route: Route,
    title: 'Manage Users Details'
  },

  {
    path: route.activityKanban,
    element: <ActivitiesKanban  />,
    route: Route,
    title: "Activities",
  },
  {
    path: route.dealtDetail,
    element: <DealDetail />,
    route: Route,
    title: "Deals Detail",
  },
  {
    path: route.dealsKanban,
    element: <DealsKanban />,
    route: Route,
    title: "Deals Kanban",
  },

  // Settings //
  {
    path: route.connectedApps,
    element: <ConnectedApps />,
    route: Route,
    title: 'ConnectedApps'
  },
  {
    path: route.notification,
    element: <Notifications />,
    route: Route,
    title: 'Notifications'
  },
  {
    path: route.noPermission,
    element: <NoPermissionPage />,
    route: Route,
    title: 'NO Permission'
  },
  {
    path: route.profile,
    element: <Profile />,
    route: Route,
    title: 'Profile'
  },
  {
    path: route.security,
    element: <Security />,
    route: Route,
    title: 'Security'
  },

  {
    path: route.appearance,
    element: <Appearance />,
    route: Route,
    title: 'Appearance'
  },
  {
    path: route.companySettings,
    element: <CompanySettings />,
    route: Route,
    title: 'Companies Settings'
  },
  {
    path: route.language,
    element: <Language />,
    route: Route,
    title: 'Language'
  },
  {
    path: route.localization,
    element: <Localization />,
    route: Route,
  },
  {
    path: route.preference,
    element: <Preference />,
    route: Route,
    title: 'Preference'
  },
  {
    path: route.prefixes,
    element: <Prefixes />,
    route: Route,
    title: 'Prefixes'
  },


  {
    path: route.customFields,
    element: <CustomFields />,
    route: Route,
    title: 'Custom Fields'
  },
  {
    path: route.invoiceSettings,
    element: <InvoiceSettings />,
    route: Route,
    title: 'Invoice Settings'
  },
  {
    path: route.printers,
    element: <Printers />,
    route: Route,
    title: 'Printers'
  },

  {
    path: route.emailSettings,
    element: <EmailSettings />,
    route: Route,
    title: 'Email Settings'
  },
  {
    path: route.gdprCookies,
    element: <GdprCookies />,
    route: Route,
    title: 'Gdpr Cookies'
  },
  {
    path: route.smsGateways,
    element: <SmsGateways />,
    route: Route,
    title: 'Sms Gateways'
  },

  {
    path: route.bankAccounts,
    element: <BankAccounts />,
    route: Route,
    title: 'Bank Accounts'
  },
  {
    path: route.currencies,
    element: <Currencies />,
    route: Route,
    title: 'Currencies'
  },
  {
    path: route.paymentGateways,
    element: <PaymentGateways />,
    route: Route,
    title: 'PaymentGateways'
  },
  {
    path: route.taxRates,
    element: <TaxRates />,
    route: Route,
    title: 'TaxRates'
  },


  {
    path: route.banIpAddrress,
    element: <BanIpAddress />,
    route: Route,
    title: 'BanIpAddress'
  },
  {
    path: route.storage,
    element: <Storage />,
    route: Route,
    title: 'Storage'
  },
  /////////// Settings /////////////////////

  {
    path: "/",
    name: "Root",
    element: <Navigate to="/login" />,
    route: Route,
    title: "Login",
  },
  {
    path: route.dealsDashboard,
    element: <DealsDashboard />,
    route: Route,
    title: 'Deals Dashboard'
  },
  {
    path: route.leadsDashboard,
    element: <LeadsDashboard />,
    route: Route,
    title: 'Leads Dashboard'
  },
  {
    path: route.projectDashboard,
    element: <ProjectDashboard />,
    route: Route,
    title: 'Projects Dashboard'
  },
];

export const publicRoutes = [
  {
    path: route.login,
    element: <Login />,
    route: Route,
    title: "Login",
  },
];
