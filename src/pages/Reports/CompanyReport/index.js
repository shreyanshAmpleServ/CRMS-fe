import React, { useCallback, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Helmet } from "react-helmet-async";
import ExportData from "../../../components/datatable/ExportData";
import SearchBar from "../../../components/datatable/SearchBar";
import { DataTable } from "./reportTable";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import { DatePicker } from "antd";
import { LoadingGraph } from "../../main-menu/deals-dashboard/loading";
import { fetchCompanyReport } from "../../../redux/companyReport";


export default function CompanyReport() {
  const [searchText, setSearchText] = useState("");
  const [yearFilter, setYearFilter] = useState();
    const [whoChange,setWhoChange] =useState()
  const dispatch = useDispatch();
  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });
  const [selectedDateRange2, setSelectedDateRange2] = useState({
    startDate: moment().subtract(180, "days"),
    endDate: moment(),
  });
  useEffect(() => {
    dispatch(
      fetchCompanyReport({
        search: searchText,
        tableDate: selectedDateRange,
        stageFilter: selectedDateRange2,
        yearFilter: yearFilter?.year(),
      })
    );
  }, [dispatch, searchText, selectedDateRange, selectedDateRange2, yearFilter]);

  const { companyReport, loading, error, success } = useSelector(
    (state) => state.companyReport
  );
  const barOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#28a745", "#dc3545"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    legend: { position: "top" },
  };
  const monthlyDeals = companyReport?.monthlyCompany || {};

  const wonData = [];

  for (let month = 1; month <= 12; month++) {
    const monthData = monthlyDeals[month] || 0;
    wonData.push(monthData || 0);
  }
  const barSeries = [
    { name: "Company ", data: wonData },
    // { name: "Lost DealValue", data: lostData },
  ];

  let labels = companyReport?.SourceByCompany?.map((item) => item?.source) || [];
  const donutOptions = {
    chart: {
      type: "donut",
    },
    labels: labels,
    colors: ["#007bff", "#6f42c1", "#dc3545", "#fd7e14"],
    legend: {
      position: "bottom",
    },

    dataLabels: {
      enabled: false,
      formatter: (val, opts) =>
        `${opts.w.config.labels[opts.seriesIndex]} - ${opts.w.config.series[opts.seriesIndex]}`,
    },
  };

  const donutSeries =
    companyReport?.SourceByCompany?.map((item) => item?.count) || [];
  const onChange = (date, dateString) => {
    setWhoChange("dealYear")
    setYearFilter(date);
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC CRMS - Contact Reports</title>
        <meta
          name="company reports"
          content="This is company reports page of DCC CRMS."
        />
      </Helmet>
      <div className="content ">
        <div className="card">
          <div className="card-header">
            <div className="row align-items-center">
              <SearchBar
                searchText={searchText}
                handleSearch={handleSearch}
                label="Search companys"
              />

              <div className="col-sm-8">
                <ExportData
                  //   exportToPDF={exportToPDF}
                  //   exportToExcel={exportToExcel}
                  label="Add Order"
                  isCreate={false}
                  id="offcanvas_add_edit_order"
                />
              </div>
            </div>
          </div>
          <div className="row   card-body ">
            {/* companys by Year */}
            <div className="col-12 vh-50   col-lg-12">
              <div className="bg-white position-relative  h-full shadow-lg rounded p-4">
                <LoadingGraph isFetching={loading}  whoChange={whoChange} name="companyYear" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h5 fw-semibold ">Company by Year</h2>
                  <DatePicker
                    onChange={onChange}
                    value={yearFilter}
                    picker="year"
                    format="YYYY"
                  />
                </div>
                <Chart
                  options={barOptions}
                  series={barSeries}
                  type="bar"
                  height={320}
                />
              </div>
            </div>

            {/* companys by Source */}
            {/* <div className="col-12 vh-50 col-lg-5">
              <div className="bg-white position-relative h-100 shadow-lg rounded p-4">
                <LoadingGraph isFetching={loading}  whoChange={whoChange} name="SourceByCompany" />

                <div className="">
                  <h3 className="h5 mb-2 fw-semibold text-nowrap ">
                    Contact by Source
                  </h3>
                  <DateRangePickerComponent
                    selectedDateRange={selectedDateRange2}
                    setSelectedDateRange={setSelectedDateRange2}
                    setWhoChange={setWhoChange}
                    ChangeName="SourceByCompany"
                  />
                </div>
                {donutSeries.length > 0 && labels.length > 0 && (
                  <Chart
                    options={donutOptions}
                    series={donutSeries}
                    type="donut"
                    height={300}
                  />
                )}
              </div>
            </div> */}
          </div>
          <DataTable
            searchText={searchText}
            setSearchText={setSearchText}
            data={companyReport?.companies}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            setWhoChange={setWhoChange}
          />
        </div>
      </div>
    </div>
  );
}
