import React, { useEffect, useMemo, useState } from "react";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent";
import SortDropdown from "../../../components/datatable/SortDropDown";
import Table from "../../../components/common/dataTableNew/index";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import UnauthorizedImage from "../../../components/common/UnAuthorized.js";
import { fetchDealReport } from "../../../redux/dealReport/index.js";

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
      title: "Deal Name",
      dataIndex: "dealName",
      render: (text, record, index) => (
        <div>
          {record.dealName}
        </div>
      ),
      sorter: (a, b) => a.dealName.localeCompare(b.dealName),
    },
    {
      title: "Value (USD)",
      dataIndex: "dealValue",
      render: (value) => <span>{value.toFixed(2)}</span>,
      sorter: (a, b) => a.dealValue - b.dealValue,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority) => (
        <span
          className={`badge ${priority === "High"
            ? "bg-danger"
            : priority === "Medium"
              ? "bg-warning"
              : "bg-success"
            }`}
        >
          {priority}
        </span>
      ),
      sorter: (a, b) => a.priority.localeCompare(b.priority),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span
          className={`badge ${status === "Open"
            ? "bg-primary"
            : status === "Won"
              ? "bg-success"
              : "bg-secondary"
            }`}
        >
          {status}
        </span>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      render: (date) => <span className="text-center m-auto">{moment(date).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: "Exp CloseDate",
      dataIndex: "expectedCloseDate",
      render: (date) => <span className="text-center m-auto">{moment(date).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) =>
        new Date(a.expectedCloseDate) - new Date(b.expectedCloseDate),
    },
    {
      title: "Assignee",
      dataIndex: "DealContacts",
      render: (value) => <span>{value?.[0]?.contact?.firstName + " "+value?.[0]?.contact?.lastName}</span>, // Replace with assignee name if available
      sorter: (a, b) => a.assigneeId - b.assigneeId,
    }
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
