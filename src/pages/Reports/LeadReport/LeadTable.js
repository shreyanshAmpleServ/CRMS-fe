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
      sorter: (a, b) => a - b,
    },
    {
      title: "Lead Name",
      dataIndex: "leadName",
      render: (text, record, index) => (
        <Link to={`/leads/${record.id}`} key={index}>
          {`${record.first_name} ${record.last_name}`}
        </Link>
      ),
      sorter: (a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Company Name",
      dataIndex: "lead_company",
      render: (text, record, index) => (
        <Link t key={index}>
          {`${text.name}`}
        </Link>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Lead Status",
      dataIndex: "crms_m_lost_reasons",
      render: (crms_m_lost_reasons) => (
        <span
          className={`badge badge-pill badge-status`}
          style={{ backgroundColor: crms_m_lost_reasons?.colorCode }}
        >
          {crms_m_lost_reasons?.name || "N/A"}
        </span>
      ),
      sorter: (a, b) => {
        const nameA = a.crms_m_lost_reasons?.name || "";
        const nameB = b.crms_m_lost_reasons?.name || "";
        return nameA.localeCompare(nameB);
      },
    },

    {
      title: "Assignee",
      dataIndex: "crms_m_user",
      render: (crms_m_user) => <span>{crms_m_user.full_name}</span>,
      sorter: (a, b) => a.crms_m_user.full_name - b.crms_m_user.full_name,
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
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
