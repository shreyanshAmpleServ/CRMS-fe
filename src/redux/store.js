// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import commonReducer from "./common/commonSlice";
import contactsReducer from "./contacts/contactSlice";
import dealReducer from "./deals";
import companyReducer from "./companies";
import pipelineReducer from "./pipelines";
import sourceReducer from "./source";
import lostReasonReducer from "./lostReasons";
import contactStages from "./contact-stages";
import industry from "./industry";
import calls from "./calls";
import callstatus from "./callStatus";
import callpurpose from "./callPurpose";
import callresult from "./callResult";
import calltype from "./callType";
import projects from "./projects";
import userReducer from "./manage-user";
import roleReducer from "./roles";
import leadsReducer from "./leads";
import statesReducer from "./state";
import countriesReducer from "./country";
import currencyReducer from "./currency";
import activitiesReducer from "./Activities";
import dashboardReducer from "./dashboard";
import vendorReducer from "./vendor";
import MeetingTypeReducer from "./meetingType";
import mappedStatesReducer from "./mappedState";
import modulesReducer from "./Modules";
import permissionsReducer from "./permissions";
import attachmentsReducer from "./attachment";
import productCategoryReducer from "./productCategory"
import manufacturerReducer from "./manufacturer"
import productsReducer from "./products"
import taxSetupReducer from "./taxSetUp"
import orderReducer from "./order"
import quotationReducer from "./quotation"
import purchaseOrderReducer from "./purchaseOrder"
import salesInvoiceReducer from "./salesInvoice"
import purchaseInvoiceReducer from "./purchaseInvoice"
import priceBookReducer from "./priceBook"
import casesReducer from "./cases"
import solutionsReducer from "./solutions"
import campaignsReducer from "./campaign"
import dealReportReducer from "./dealReport"
import leadReportReducer from "./leadReport"
import contactReportReducer from "./contactReport"
import companyReportReducer from "./companyReport"
import projectReportReducer from "./projectReport"
import TaskReportReducer from "./TaskReport"

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    common: commonReducer,
    contacts: contactsReducer,
    deals: dealReducer,
    companies: companyReducer,
    pipelines: pipelineReducer,
    sources: sourceReducer,
    lostReasons: lostReasonReducer,
    contactStages: contactStages,
    industries: industry,
    callStatuses: callstatus,
    calls: calls,
    callPurposes: callpurpose,
    callResults: callresult,
    callTypes: calltype,
    projects: projects,
    users: userReducer,
    roles: roleReducer,
    leads: leadsReducer,
    states: statesReducer,
    mappedStates: mappedStatesReducer,
    countries: countriesReducer,
    currency: currencyReducer,
    activities: activitiesReducer,
    vendor:vendorReducer,
    meetingTypes:MeetingTypeReducer,
    modules : modulesReducer,
    permissions: permissionsReducer,
    attachments : attachmentsReducer,
    productCategories : productCategoryReducer,
    manufacturers : manufacturerReducer,
    products : productsReducer,
    taxs : taxSetupReducer,
    orders : orderReducer,
    quotations : quotationReducer,
    purchaseOrders : purchaseOrderReducer,
    salesInvoices : salesInvoiceReducer,
    purchaseInvoices : purchaseInvoiceReducer,
    priceBooks : priceBookReducer,
    cases: casesReducer,
    solutions : solutionsReducer,
    campaigns : campaignsReducer,
    dealReport : dealReportReducer,
    leadReport : leadReportReducer,
    contactReport : contactReportReducer,
    companyReport : companyReportReducer,
    projectReport : projectReportReducer,
    taskReport : TaskReportReducer,
  },
});

export default store;
