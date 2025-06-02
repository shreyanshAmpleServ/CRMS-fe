import ApexCharts from "apexcharts";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import {  fetchLeadDashboard } from "../../../redux/dashboard";
import { fetchPipelines } from "../../../redux/pipelines";
import { LoadingGraph } from "./loading";
import NoDataFound from "../../../components/common/NotFound/NotFount";
import { Helmet } from "react-helmet-async";
import Chart from "react-apexcharts";
import { fetchLostReasons } from "../../../redux/lostReasons";


const LeadsDashboard = () => {
  const [dashboardData,setDashboardData] = useState([])
  const [lostDealData,setLostDealData] = useState([])
  const [winDealData,setWinDealData] = useState([])
  const [monthlyDealData,setMonthlyDealData] = useState([])
  const [whoChange,setWhoChange] =useState()
  const [isFetching, setIsFetching] = useState(false); // Track API call
  const [dealStageFilter, setDealStageFilter] = useState();
  const [lostDealFilter, setLostDealFilter] = useState();
  const [wonDealFilter, setWonDealFilter] = useState();
  const [monthlyDealFilter, setMonthlyDealFilter] = useState();
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(180, "days"), // Default start date (Last 7 days)
    endDate: moment(),
  });
   const { lostReasons } = useSelector((state) => state.lostReasons);
    const lostReasonsList = lostReasons.map((emnt) => ({
      value: emnt.id,
      label: emnt.name,
    }));
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);
  useEffect(()=>{
    setWhoChange("")
  },[selectedDateRange])
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPipelines());
    dispatch(fetchLostReasons());
  }, [dispatch]);
  React.useEffect(() => {
    setIsFetching(true); 
    dispatch(
      fetchLeadDashboard({
        ...selectedDateRange,
        dealsPipelineFilter: dealStageFilter?.id || null,
        lostDealFilter: lostDealFilter?.id || null,
        wonDealFilter: wonDealFilter?.id || null,
        monthlyLeadFilter: monthlyDealFilter?.id || null,
      })).finally(() => {
        setIsFetching(false); // Finish API call
      });
  }, [
    dispatch,
    selectedDateRange,
    dealStageFilter,
    lostDealFilter,
    wonDealFilter,
    monthlyDealFilter,
  ]);
  const { pipelines } = useSelector((state) => state.pipelines);

 // Deals By Stage
  const chartRef = useRef(null);
  const { leadDashboard, loading, error, success } = useSelector((state) => state.dashboard);
  useEffect(()=>{
    (whoChange === "LeadStage" || whoChange === "" || !dashboardData?.length) && setDashboardData(leadDashboard.leads)
  },[leadDashboard,dealStageFilter])
  useEffect(() => {
    const chart1 = dashboardData?.map((item) => ({
      x: item?.dealName,
      y: item?.dealValue,
    }));
    // if (!dashboardData.deals || isFetching) return;
    if (chartRef.current) {
      const options = {
        series: [
          {
            name: "Lead Source",
            colors: ["#FFC38F"],
            data: chart1 ? chart1 : [{ x: 0, y: 0 }],
          },
        ],
        chart: {    
          type: "donut",
          height: 300,
        },
        plotOptions: {
          bar: {
            borderRadiusApplication: "around",
            columnWidth: "50%",
          },
        },
        colors: ["#00918E"],
        xaxis: {
          type: "category",
          title: {
            text: "Stages", // Label for the x-axis
            style: {
              fontSize: "12px",
              fontWeight: 700,
              color: "#333",
            },
          },
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          categories: dashboardData?.leads?.length
            ? dashboardData?.leads?.map((item) => item.stages.name)
            : ["0"],
          title: {
            text: "Deal Value", // Label for the x-axis
            style: {
              fontSize: "12px",
              fontWeight: 700,
              color: "#333",
            },
          },
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
          tickAmount: 6,
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [dashboardData]);

//   Lead By source 
let labels = leadDashboard?.leadSources?.map((item) => item?.source) || [];
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
  leadDashboard?.leadSources?.map((item) => item?.count) || [];

  //  Leads By Stage
  const LeadsBySatge = useRef(null);
  useEffect(()=>{
    (whoChange === "LostDeal" || whoChange === "" || !lostDealData?.length) && setLostDealData(leadDashboard.lostLeads)
  },[leadDashboard,lostDealFilter])
 

  useEffect(() => {
    const lostChart = lostDealData?.map((item) => ({
      x: item?.dealName || "Unknown",
      y: item?.dealValue || 0,
    }));
    // if (!dashboard.lostDeals || isFetching) return;
    if (LeadsBySatge.current) {
      const options = {
        series: [
          {
            name: "Deal Value",
            colors: ["#FFC38F"],
            data: lostDealData?.length ? lostChart : [{ x: 0, y: 0 }],
          },
        ],
        chart: {
          type: "bar",
          height: 150,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#FC0027"],
        xaxis: {
          categories: lostDealData?.length
            ? lostDealData?.map((item) => item.leads.name)
            : ["0"],

          //     // tickAmount: 6,
        },
      };

      const chart = new ApexCharts(LeadsBySatge.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [lostDealData]);
  // Won Deals Chat
  const wonChat = useRef(null);
  useEffect(()=>{
    (whoChange === "WinDeal" || whoChange === "" || !winDealData?.length) && setWinDealData(leadDashboard.wonLeadss)
  },[leadDashboard,wonDealFilter])
 

  useEffect(() => {
    const winChart = winDealData?.map((item) => ({
      x: item?.dealName || "Unknowen",
      y: item?.dealValue || 0,
    }));
    // if (!dashboard.wonDeals || isFetching) return; 
    const options = {
      series: [
        {
          name: "Deal Value",
          colors: ["#FFC38F"],
          data: winDealData?.length ? winChart : [{ x: 0, y: 0 }],
        },
      ],
      chart: {
        type: "bar",
        height: 150,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#5CB85C"],
      xaxis: {
        categories: winDealData?.length
          ? winDealData?.map((item) => item.leads.name)
          : ["0"],
        //   // min: 0,
        //   // max: 500,
        //   // tickAmount: 5,
      },
    };

    if (wonChat.current) {
      const chart = new ApexCharts(wonChat.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [winDealData]);
  // Deals By Year
  const dealsByYear = useRef(null);
  // Define all months in order
  useEffect(()=>{
    (whoChange === "MonthlyDeal" || whoChange === "" || !monthlyDealData?.length) && setMonthlyDealData(leadDashboard.monthlyLeads)
  },[leadDashboard,monthlyDealFilter])
  
  // Convert `monthlyDeals` object into an array with correct month order
  
  useEffect(() => {
    const defaultData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const months = [
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
    ];
    const data = months.map(
      (_, index) => monthlyDealData?.[index + 1] || 0
    );
    const options = {
      series: [
        {
          name: "Leads",
          data: data || defaultData,
        },
      ],
      chart: {
        height: 273,
        type: "area",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#E41F07"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: "",
        align: "left",
      },
      xaxis: {
        categories: months,
      },
      yaxis: {
        // min: 10,
        // max: 60,
        tickAmount: 5,
        labels: {
          formatter: (val) => {
            return val ;
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    };

    if (dealsByYear.current) {
      const chart = new ApexCharts(dealsByYear.current, options);
      chart.render();

      // Cleanup on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [monthlyDealData]);
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (location.pathname === "/dashboard/leads-dashboard") {
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 2000);
    }
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>DCC CRMS -Lead Dashboard</title>
        <meta name="Lead Dashboard" content="This is Lead Dashboard page of DCC CRMS." />
      </Helmet>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <div className="row align-items-center ">
                  <div className="col-md-4">
                    <h3 className="page-title">Lead Dashboard</h3>
                  </div>
                  <div className="col-md-8 float-end ms-auto">
                    <div className="d-flex title-head">
                      <div className="daterange-picker d-flex align-items-center justify-content-center">
                        <DateRangePickerComponent
                          selectedDateRange={selectedDateRange}
                          setSelectedDateRange={setSelectedDateRange}
                        />
                        <div className="head-icons mb-0">
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="refresh-tooltip">Refresh</Tooltip>
                            }
                          >
                            <Link
                              to="#"
                              onClick={() => {
                                setDealStageFilter(null);
                                setLostDealFilter(null);
                                setWonDealFilter(null);
                                setMonthlyDealFilter(null);
                              }}
                            >
                              <i className="ti ti-refresh-dot" />
                            </Link>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div  className="scroll-container col-md-6 position-relative">
            <LoadingGraph isFetching={isFetching}  whoChange={whoChange} name="" />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Recently Created Leads
                    </h4>
                  </div>
                </div>
                <div className="card-body">
                  <div  style={{height:"38.7vh" , marginBottom:"15px", overflowY:"scroll"}} className="scroll-containe table-responsive custom-table">
                    <table className="table dataTable" id="leads-project">
                      <thead className="thead-light">
                        <tr>
                          <th>Title</th>
                          <th>Name</th>
                          <th>Company</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody >
                        { leadDashboard?.leads?.map((item) => (
                          <tr  className="odd">
                            <td >{item?.title}</td>
                            <td ><span style={{width:"10px !important" , overflow:"hidden"}}>{item?.first_name  +" "+item?.last_name}</span></td>
                            <td>{item?.lead_company?.name}</td>
                            <td>{item?.phone}</td>
                            <td>{item?.email}</td>
                            <td> <span
          className={`text-white badge badge-pill badge-status`}
          style={{ backgroundColor: item?.crms_m_lost_reasons?.colorCode }}
        >{item?.crms_m_lost_reasons?.name}</span></td>
                            <td>
                              <span
                                className={`badge badge-pill  ${item?.status == "Open" ? "bg-info" : item?.status == "Lost" ? "bg-danger" : "bg-success"}`}
                              >
                                {item?.status}
                              </span>
                            </td>
                          </tr>
                        )) }
                      {/* // : <div style={{width:"100%", height:'60%'}} className=" d-flex justify-content-center mx-25 ">  </div>} */}
                      </tbody>
                    </table>
                    {/* <NoDataFound /> */}
                    {!leadDashboard?.leads?.length &&  <div style={{marginLeft:"25%" , marginTop:"10%"}}  className="d-flex flex-column align-items-center justify-content-center h-50 w-50  py-5 gap-3">
                    <img src="https://pub-16f3de4d2c4841169d66d16992f9f0d3.r2.dev/assets/Sales/pana.svg" alt="" />
                    <p className="h5 font-weight-semibold">No Data Found</p>
            
      </div>}
                  </div>
                </div>
              </div>
            </div>
            <div  className="col-md-6 position-relative ">
            <LoadingGraph isFetching={isFetching}  whoChange={whoChange} name="LeadStage" />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Leads By Source
                    </h4>
                    <div
                      style={{ width: "34%" }}
                      className="d-flex align-items-center flex-wrap row-gap-2"
                    >
                      {/* <div className="dropdown w-100 me-2">
                        <Link
                          className="dropdown-toggle text-nowrap text-truncate"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <div
                            style={{ width: "95%" }}
                            className="text-truncate"
                          >
                            {" "}
                            {dealStageFilter?.name || "Select Pipline"}{" "}
                          </div>
                        </Link>
                        <div className="dropdown-menu w-100 dropdown-menu-end">
                          <Link
                            to="#"
                            onClick={() =>{
                              setDealStageFilter({
                                id: null,
                                name: "Select Pipline",
                              });
                            setWhoChange("LeadStage")}
                            }
                            className="dropdown-item"
                          >
                            All Pipline
                          </Link>
                          {pipelines?.data?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() =>{
                                setDealStageFilter({
                                  id: item.id,
                                  name: item.name,
                                })
                                setWhoChange("LeadStage")
                              }}
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div> */}
                    
                    </div>
                  </div>
                </div>
                <div style={{height:"43.5vh" , marginBottom:"15px", overflowY:"hidden"}} className=" card-body">
                  {/* <div id="leads-chart" ref={chartRef} /> */}
                    {donutSeries.length > 0 && labels.length > 0 && (
                                    <Chart
                                      options={donutOptions}
                                      series={donutSeries}
                                      type="donut"
                                      height={230}
                                    />
                                  )}
                                    {/* <NoDataFound /> */}
                    {!donutSeries.length > 0 && !labels.length > 0 &&  <div style={{marginLeft:"25%" , marginTop:"10%"}}  className="d-flex flex-column align-items-center justify-content-center h-50 w-50  py-5 gap-3">
                    <img src="https://pub-16f3de4d2c4841169d66d16992f9f0d3.r2.dev/assets/Sales/pana.svg" alt="" />
                    <p className="h5 font-weight-semibold">No Data Found</p>
            
      </div>}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-6 position-relative ">
            <LoadingGraph isFetching={isFetching}  whoChange={whoChange} name="LostDeal" />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Lost Deads Stage
                    </h4>
                    <div
                      style={{ width: "34%" }}
                      className="d-flex align-items-center flex-wrap row-gap-2"
                    >
                      <div className="dropdown w-100 me-2">
                        <Link
                          className="dropdown-toggle text-nowrap text-truncate"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <div
                            style={{ width: "95%" }}
                            className="text-truncate"
                          >
                            {" "}
                            {lostDealFilter?.name || "Select Pipline"}{" "}
                          </div>
                        </Link>
                        <div className="dropdown-menu w-100 dropdown-menu-end">
                          <Link
                            to="#"
                            onClick={() =>{
                              setLostDealFilter({
                                id: null,
                                name: "Select Pipline",
                              })
                              setWhoChange("LostDeal")
                           } }
                            className="dropdown-item"
                          >
                            All Pipline
                          </Link>
                          {pipelines?.data?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() =>{
                                setLostDealFilter({
                                  id: item.id,
                                  name: item.name,
                                });
                                setWhoChange("LostDeal")}
                              }
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="last-chart" ref={LeadsBySatge} />
                </div>
              </div>
            </div>
            <div className="col-md-6 position-relative ">
            <LoadingGraph isFetching={isFetching}  whoChange={whoChange} name="WinDeal" />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Won Leads Stage
                    </h4>
                    <div
                      style={{ width: "34%" }}
                      className="d-flex align-items-center flex-wrap row-gap-2"
                    >
                      <div className="dropdown w-100 me-2">
                        <Link
                          className="dropdown-toggle text-nowrap text-truncate"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <div
                            style={{ width: "95%" }}
                            className="text-truncate"
                          >
                            {" "}
                            {wonDealFilter?.name || "Select Pipline"}{" "}
                          </div>
                        </Link>
                        <div className="dropdown-menu w-100 dropdown-menu-end">
                          <Link
                            to="#"
                            onClick={() =>{
                              setWonDealFilter({
                                id: null,
                                name: "Select Pipline",
                              })
                              setWhoChange("WinDeal")
                            }}
                            className="dropdown-item"
                          >
                            All Pipline
                          </Link>
                          {pipelines?.data?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() =>{
                                setWonDealFilter({
                                  id: item.id,
                                  name: item.name,
                                })
                                setWhoChange("WinDeal")
                              }}
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="won-chart" ref={wonChat} />
                </div>
              </div>
            </div>
          </div> */}
          <div className="row position-relative">
          <LoadingGraph isFetching={isFetching}  whoChange={whoChange} name="MonthlyDeal" />
           <div className="col-md-12 d-flex">
              <div className="card
               w-100">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Leads by Year
                    </h4>
                    <div
                      style={{ width: "20%" }}
                      className="d-flex align-items-center flex-wrap row-gap-2"
                    >
                      <div className="dropdown w-100 me-2">
                        <Link
                          className="dropdown-toggle text-nowrap text-truncate"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          <div
                            style={{ width: "95%" }}
                            className="text-truncate"
                          >
                            {" "}
                            {monthlyDealFilter?.name || "Select Status"}{" "}
                          </div>
                        </Link>
                        <div className="dropdown-menu w-100 dropdown-menu-end">
                          <Link
                            to="#"
                            onClick={() =>{
                              setMonthlyDealFilter({
                                id: null,
                                name: "Select Pipline",
                              })
                              setWhoChange("MonthlyDeal")
                            }}
                            className="dropdown-item"
                          >
                            All 
                          </Link>
                          {lostReasonsList?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() =>{
                                setMonthlyDealFilter({
                                  id: item.value,
                                  name: item.label,
                                })
                                setWhoChange("MonthlyDeal")
                              }}
                              className="dropdown-item"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="leads-year" ref={dealsByYear} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadsDashboard;
