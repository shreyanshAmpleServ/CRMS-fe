// index.tsx
import React, { useState } from "react";
import { Table, Spin } from "antd";
import UnauthorizedImage from "../UnAuthorized.js/index.js";

const Datatable = ({ columns, dataSource,className,border, paginationData,onPageChange, loading = false ,isView=true }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handlePageChange = (page, size) => {
    if (onPageChange) {
      onPageChange({ currentPage: page, pageSize: size });
    }
  };
  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin tip="Loading data..." size="large" />
        </div>
      ) :

       isView ? (
<Table
          className={`table datanew dataTable no-footer  ${className}` }
          columns={columns}
          dataSource={dataSource}
          // rowSelection={rowSelection}
          cellPaddingInlineSM
          pagination={paginationData?.totalCount > 0 ? 
             { 
              current:  paginationData?.currentPage || 1,
            pageSize:  paginationData?.pageSize || 10,
            total: paginationData?.totalCount || 1,
            showSizeChanger: true,
            onChange: handlePageChange,
          }: false}
          // pagination={paginaiton === false ? false : true}
          bordered={border || false}
        style={{ minHeight: "400px" }}
          scroll={{ x: "max-content" }}
                  />)
        :
        <UnauthorizedImage />
      }

    </>
  );
};

export default Datatable;
