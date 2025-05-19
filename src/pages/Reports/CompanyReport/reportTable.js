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
      title: "Company Name",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`/companies/${record.id}`}>{record.name}</Link>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Website",
      dataIndex: "website",
      render: (text) =>
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          "N/A"
        ),
      sorter: (a, b) => (a.website || "").localeCompare(b.website || ""),
    },
    {
      title: "Industry Type",
      dataIndex: "industryType",
      sorter: (a, b) => a.industryType.localeCompare(b.industryType),
    },
    {
      title: "Annual Revenue",
      dataIndex: "annualRevenue",
      sorter: (a, b) => (a.annualRevenue || 0) - (b.annualRevenue || 0),
    },
    {
      title: "Emp Count",
      dataIndex: "employeeCount",
      sorter: (a, b) => (a.employeeCount || 0) - (b.employeeCount || 0),
    },
    {
      title: "Business Type",
      dataIndex: "businessType",
      sorter: (a, b) => a.businessType.localeCompare(b.businessType),
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
