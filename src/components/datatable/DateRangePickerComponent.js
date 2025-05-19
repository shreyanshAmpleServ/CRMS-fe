import React from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";

const DateRangePickerComponent = ({
  selectedDateRange,
  setSelectedDateRange,
  setIsRange= ()=>{},
  setWhoChange= ()=>{},
  ChangeName=""
}) => {
  const settings = {
    startDate: selectedDateRange.startDate,
    endDate: selectedDateRange.endDate,
    ranges: {
      "Last 30 Days": [moment().subtract(30, "days"), moment()],
      "Last 7 Days": [moment().subtract(7, "days"), moment()],
      "Last Month": [
        moment().subtract(1, "months").startOf("month"),
        moment().subtract(1, "months").endOf("month"),
      ],
      "This Month": [moment().startOf("month"), moment().endOf("month")],
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    },
    timePicker: false,
  };

  const handleCallback = (start, end) => {
    setSelectedDateRange({
      startDate: moment(start),
      endDate: moment(end),
    });
    setWhoChange(ChangeName)
    setIsRange(true)
  };

  return (
    <div className="icon-form">
      <span className="form-icon">
        <i className="ti ti-calendar" />
      </span>
      <DateRangePicker initialSettings={settings} onCallback={handleCallback}>
        <input
          className="form-control bookingrange"
          type="text"
          value={`${selectedDateRange.startDate.format(
            "DD-MM-YYYY",
          )} - ${selectedDateRange.endDate.format("DD-MM-YYYY")}`}
        />
      </DateRangePicker>
    </div>
  );
};

export default DateRangePickerComponent;
