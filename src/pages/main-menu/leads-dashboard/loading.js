export const LoadingGraph =({isFetching,whoChange,name})=>{
  const theme = localStorage.getItem("dataTheme") === "dark"
    return (<>
      {isFetching && (whoChange === name || whoChange === "")   &&  <div
            style={{
              zIndex: 9999,
              paddingTop: name=== "MonthlyDeal" ? "8%" :"20%",
              paddingLeft: "42%",
              width: "95%",
              marginLeft: "0%",
              height: "78%",
              marginTop:"55px",
              borderRadius:"10px",
              backgroundColor: !theme ? "rgba(255, 255, 255,.8)" :"rgba(30, 30, 45, 0.9)",
            }}
            className=" position-absolute   "
          >
            <div
              className="spinner-border position-absolute d-flex justify-content-center  text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>}</>)
}