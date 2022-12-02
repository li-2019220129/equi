import moment from "moment";
export const exportExcel = (tHeader, tData, filterVal, title) => {
  const time = moment(new Date()).format("YYYY-MM-DD");
  const defaultTitle = `${title}-${time}`;
  const { export_json_to_excel2 } = require("./Export2Excel");
  // const tHeader = th.map((v) => {
  //   return v.label;
  // });
  // const filterVal = th.map((v) => {
  //   return v.prop;
  // });

  export_json_to_excel2(tHeader, tData, filterVal, defaultTitle);
};

export default exportExcel;
