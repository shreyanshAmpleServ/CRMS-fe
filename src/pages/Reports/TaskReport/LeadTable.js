import React, { useEffect, useMemo, useState } from "react";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent.js";
import SortDropdown from "../../../components/datatable/SortDropDown.js";
import Table from "../../../components/common/dataTableNew/index";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import UnauthorizedImage from "../../../components/common/UnAuthorized.js/index.js";
import { fetchDealReport } from "../../../redux/dealReport/index.js";
import { Link } from "react-router-dom";

export const DataTable = ({data ,searchText,setSearchText ,setWhoChange, selectedDateRange, setSelectedDateRange}) => {
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState();
//   React.useEffect(() => {
//     dispatch(fetchDealReport({ search: searchText, ...selectedDateRange }));
//   }, [dispatch, searchText, selectedDateRange]);
  const {  loading } = useSelector(
    (state) => state.dealReport
  );
  useEffect(() => {
    setPaginationData({
      currentPage: data?.currentPage,
      totalPage: data?.totalPages,
      totalCount: data?.totalCount,
      pageSize: data?.size,
    });
  }, [data]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchDealReport({
        search: searchText,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Activity Type",
      dataIndex: "crms_m_activitytypes",
      render: (text, record, a) => (
        <>
          {text?.id ? (
            <span
              className={`badge activity-badge ${text?.name === "Calls" ? "bg-success" : text?.name === "Emails" ? "bg-purple" : text?.name === "Task" ? "bg-blue" : text?.name === "Task" ? "bg-red" : "bg-warning"}`}
            >
              {/* <i className={record?.icon} /> */}

              {text?.name || " "}
            </span>
          ) : (
            " -- "
          )}
        </>
      ),
      sorter: (a, b) => a.crms_m_activitytypes.length - b.crms_m_activitytypes.length,
    },

    {
      title: "Due Date",
      dataIndex: "due_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
      sorter: (a, b) => a.due_date.length - b.due_date.length,
    },
    {
      title: "Owner",
      dataIndex: "crms_m_user",
      render: (text) => <div>{text.full_name}</div>,
      sorter: (a, b) => a.crms_m_user.length - b.crms_m_user.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) =>     <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: text === "In Progress" ? "blue" :  text === "Completed" ? "green" : text === "Canceled" ? "red"  : text === "Waiting for someone else" ? "orange"  :  "black", // Use color property from options
          display: "inline-block",
        }}
      />
      {text}
    </div>,
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Created At",
      dataIndex: "created_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY HH:mm A")}</div>,
      sorter: (a, b) => a.created_date.length - b.created_date.length,
    },
  ];
    const filteredData = useMemo(() => {
    let datas = data || [];

    if (sortOrder === "ascending") {
      datas = [...datas]?.sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      datas = [...datas].sort((a, b) => {
        const dateA = moment(a.createdDate);
        const dateB = moment(b.createdDate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return datas;
  }, [searchText, selectedDateRange, data, columns, sortOrder]);

  console.log("filteredData", filteredData);
  return (
    <>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
          <div className="d-flex align-items-center flex-wrap row-gap-2">
            <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
            <DateRangePickerComponent
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
                setWhoChange={setWhoChange}
                ChangeName=""
            />
          </div>
          <div className="d-flex align-items-center flex-wrap row-gap-2">
            {/* <FilterComponent
                      applyFilters={({ status }) => {
                        setSelectedStatus(status);
                      }}
                    />
                    <ViewIconsToggle view={view} setView={setView} /> */}
          </div>
        </div>

        {/* {isView ? ( */}
          <div className="table-responsive custom-table">
              <Table
                dataSource={filteredData}
                columns={columns}
                loading={loading}
                paginationData={paginationData}
                onPageChange={handlePageChange}
              />
            
          </div>
        {/* ) : (
          <UnauthorizedImage />
        )} */}
      </div>
    </>
  );
};
