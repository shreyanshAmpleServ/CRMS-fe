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
        title: "Name",
        dataIndex: "name",
        render: (text, record, index) => (
          <Link to={`/contacts/${record?.id}`} className="" key={index}>
            {`${record.firstName} ${record.lastName}`}
          </Link>
        ),
        sorter: (a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        },
      },
      {
        title: "Phone",
        dataIndex: "phone1",
        sorter: (a, b) => a.phone1.length - b.phone1.length,
      },
      {
        title: "Email",
        dataIndex: "email",
        sorter: (a, b) => a.email.length - b.email.length,
      },
      {
        title: "Location",
        dataIndex: "contact_Country",
        render: (text,record) => (<div>{record.contact_State?.name + ", "+record.contact_Country?.name}</div>),
        sorter: (a, b) => a.country.length - b.country.length,
      },
      // {
      //   title: "Contact",
      //   dataIndex: "",
      //   render: (record) => (
      //     <div className="social-links d-flex align-items-center">
      //       <li>
      //         <Link target="_blank" to="#">
      //         <a
      //           href={`mailto:${record.email}`}
      //           target="_blank"
      //           rel="noopener noreferrer"
      //         >
      //           <i className="ti ti-mail me-2"></i>
      //         </a>
      //         </Link>
      //       </li>
      //       <li>
      //         <Link target="_blank" to="#">
      //         <a
      //           href={`tel:${record.phone1}`}
      //           target="_blank"
      //           rel="noopener noreferrer"
      //         >
      //           <i className="ti ti-phone-check me-2"></i>
      //         </a>
      //         </Link>
      //       </li>
      //       <li>
      //         <Link target="_blank" to="#">
      //         <a
      //           href={`https://wa.me/${record.phone1}`}
      //           target="_blank"
      //           rel="noopener noreferrer"
      //         >
      //           <i className="ti ti-message-circle-share me-2"></i>
      //         </a>  
      //         </Link>
      //       </li>
      //       <li>
      //         <Link target="_blank" to="">
      //         <a
      //           href={`skype:${record.phone1}?call`}
      //           target="_blank"
      //           rel="noopener noreferrer"
      //         >
      //           <i className="ti ti-brand-skype me-2"></i>
      //         </a>
      //         </Link>
      //       </li>
      //       <li>
      //         <Link target="_blank" to="#">
      //         <a
      //           href={record.socialProfiles?.facebook || "#"}
      //           target="_blank"
      //           rel="noopener noreferrer"
      //         >
      //           <i className="ti ti-brand-facebook"></i>
      //         </a>
      //         </Link>
      //       </li>
      //     </div>
      //   ),
      // },
      {
        title: "Created Date",
        dataIndex: "createdate",
        render: (text) => (
          <span>{moment(text).format("DD-MM-YYYY")}</span> // Format the date as needed
        ),
        sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate), // Sort by date
      },
      {
        title: "Status",
        dataIndex: "is_active",
        render: (text) => (
          <div>
            {text === "Y" ? (
              <span className="badge badge-pill badge-status bg-success">
                Active
              </span>
            ) : (
              <span className="badge badge-pill badge-status bg-danger">
                Inactive
              </span>
            )}
          </div>
        ),
        sorter: (a, b) => a.is_active.localeCompare(b.is_active),
      },

    ]
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
