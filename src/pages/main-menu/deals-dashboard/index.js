import ApexCharts from "apexcharts";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import { fetchDashboard } from "../../../redux/dashboard";
import { fetchPipelines } from "../../../redux/pipelines";
import { LoadingGraph } from "./loading";
import NoDataFound from "../../../components/common/NotFound/NotFount";
import { Helmet } from "react-helmet-async";

const DealsDashboard = () => {
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
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);
  useEffect(()=>{
    setWhoChange("")
  },[selectedDateRange])
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPipelines());
  }, [dispatch]);
  React.useEffect(() => {
    setIsFetching(true); 
    dispatch(
      fetchDashboard({
        ...selectedDateRange,
        dealsPipelineFilter: dealStageFilter?.id || null,
        lostDealFilter: lostDealFilter?.id || null,
        wonDealFilter: wonDealFilter?.id || null,
        monthlyDealFilter: monthlyDealFilter?.id || null,
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
  const { dashboard, loading, error, success } = useSelector((state) => state.dashboard);
  useEffect(()=>{
    (whoChange === "DealStage" || whoChange === "" || !dashboardData?.length) && setDashboardData(dashboard.deals)
  },[dashboard,dealStageFilter])
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
            name: "Deal Value",
            colors: ["#FFC38F"],
            data: chart1 ? chart1 : [{ x: 0, y: 0 }],
          },
        ],
        chart: {
          type: "bar",
          height: 275,
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
          categories: dashboardData?.deals?.length
            ? dashboardData?.deals?.map((item) => item.stages.name)
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

  //  Leads By Stage
  const LeadsBySatge = useRef(null);
  useEffect(()=>{
    (whoChange === "LostDeal" || whoChange === "" || !lostDealData?.length) && setLostDealData(dashboard.lostDeals)
  },[dashboard,lostDealFilter])
 

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
            ? lostDealData?.map((item) => item.deals.name)
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
    (whoChange === "WinDeal" || whoChange === "" || !winDealData?.length) && setWinDealData(dashboard.wonDeals)
  },[dashboard,wonDealFilter])
 

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
          ? winDealData?.map((item) => item.deals.name)
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
    (whoChange === "MonthlyDeal" || whoChange === "" || !monthlyDealData?.length) && setMonthlyDealData(dashboard.monthlyDeals)
  },[dashboard,monthlyDealFilter])
  
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
          name: "Deals",
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
        curve: "straight",
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
            return (val / 1000).toFixed(2) + "K";
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
    if (location.pathname === "/dashboard/deals-dashboard") {
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 2000);
    }
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>DCC CRMS - Dashboard</title>
        <meta name="Dashboard" content="This is Dashboard page of DCC CRMS." />
      </Helmet>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <div className="row align-items-center ">
                  <div className="col-md-4">
                    <h3 className="page-title">Dashboard</h3>
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
                      Recently Created Deals
                    </h4>
                    {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="card-body">
                  <div  style={{height:"38.7vh" , marginBottom:"15px", overflowY:"scroll"}} className="scroll-containe table-responsive custom-table">
                    <table className="table dataTable" id="deals-project">
                      <thead className="thead-light">
                        <tr>
                          <th>Deal Name</th>
                          <th>Stage</th>
                          <th>Deal Value</th>
                          <th>Priority</th>
                          {/* <th>Probability</th> */}
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody >
                        { dashboard?.deal?.map((item) => (
                          <tr  className="odd">
                            <td>{item?.dealName}</td>
                            <td>{item?.deals?.name}</td>
                            <td>{item?.currency + " " + item?.dealValue}</td>
                            <td>{item?.priority}</td>
                            {/* <td>85%</td> */}
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
                    {!dashboard?.deal?.length &&  <div style={{marginLeft:"25%" , marginTop:"10%"}}  className="d-flex flex-column align-items-center justify-content-center h-50 w-50  py-5 gap-3">
                    <img src="https://pub-16f3de4d2c4841169d66d16992f9f0d3.r2.dev/assets/Sales/pana.svg" alt="" />
                    <p className="h5 font-weight-semibold">No Data Found</p>
            
      </div>}
                  </div>
                </div>
              </div>
            </div>
            <div  className="col-md-6 position-relative ">
            <LoadingGraph isFetching={isFetching}  whoChange={whoChange} name="DealStage" />
              <div className="card flex-fill">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Deals By Stage
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
                            setWhoChange("DealStage")}
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
                                setWhoChange("DealStage")
                              }}
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div style={{height:"40vh" , marginBottom:"15px", overflowY:"hidden"}} className="card-body">
                  <div id="deals-chart" ref={chartRef} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
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
                      {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
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
                      Won Deals Stage
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
                      {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="won-chart" ref={wonChat} />
                </div>
              </div>
            </div>
          </div>
          <div className="row position-relative">
          <LoadingGraph isFetching={isFetching}  whoChange={whoChange} name="MonthlyDeal" />
           <div className="col-md-12 d-flex">
              <div className="card
               w-100">
                <div className="card-header border-0 pb-0">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h4>
                      <i className="ti ti-grip-vertical me-1" />
                      Deals by Year
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
                            {monthlyDealFilter?.name || "Select Pipline"}{" "}
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
                            All Pipline
                          </Link>
                          {pipelines?.data?.map((item) => (
                            <Link
                              key={item.id}
                              to="#"
                              onClick={() =>{
                                setMonthlyDealFilter({
                                  id: item.id,
                                  name: item.name,
                                })
                                setWhoChange("MonthlyDeal")
                              }}
                              className="dropdown-item"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* <div className="dropdown">
                      <Link
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        to="#"
                      >
                        <i className="ti ti-calendar-check me-2" />
                        {filterDays === null ? "Select" :filterDays === 15 ?"Last 30 days" :  "Last 30 days"}
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(null)}>
                         All
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(7)}>
                          Last 7 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(15)}>
                          Last 15 days
                        </Link>
                        <Link to="#" className="dropdown-item" onClick={()=>setFilterDays(30)}>
                          Last 30 days
                        </Link>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div id="deals-year" ref={dealsByYear} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DealsDashboard;
