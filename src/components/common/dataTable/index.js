// index.tsx
import React, { useState } from "react";
import { Table, Spin } from "antd";
import UnauthorizedImage from "../UnAuthorized.js";

const Datatable = ({ columns, dataSource,className,border, paginaiton,isPermission=false , loading = false ,isView=true }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" , margin:"auto" }}>
          <Spin tip="Loading data..." size="large" />
        </div>
      ) :

       isView ? 
//        <iframe
//   src="https://mowara.dcclogsuite.com/ng/login"
//   width="100%"
//   height="600"
//   style={{ border: 'none' }}
//   title="Embedded Website"
// />
(<div style={{ minHeight: "400px", overflow: 'auto' }} className="custom-table-wrapper">
       <Table
          className={`table datanew dataTable   scroll-container ${className}` }
          columns={columns}
          dataSource={dataSource}
          // rowSelection={rowSelection}
          cellPaddingInlineSM
          // pagination={paginationData?.totalCount > 0 ? 
          //    { 
          //     current:  paginationData?.currentPage || 1,
          //   pageSize:  paginationData?.pageSize || 5,
          //   total: paginationData?.totalCount || 1,
          //   // showSizeChanger: true,
          //   onChange: handlePageChange,
          // }: false}
          pagination={paginaiton === false ? false : true}
          bordered={border || false}
          min
          scroll=  {isPermission ? { y: 460,x: "max-content" } : { y: undefined,x: "max-content" } } // Set desired height for scrollable body
          sticky={isPermission && { offsetHeader: 0 }}

        />  </div>
      )
        :
        <UnauthorizedImage />
      }

    </>
  );
};

export default Datatable;
