import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useReport = defineStore("report", () => {
  const reportCategoryList = ref([]);
  const reportList = ref([]);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setReportCategory(data) {
    reportCategoryList.value = data;
  }

  function setReport(data) {
    reportList.value = data;
  }

  // START REPORT CATEGORY

  function getAllReportCategory(params?: any) {
    return ApiService.query("/reports/get-all-cate-reports", params)
      .then(({ data }) => {
        setReportCategory(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function createReportCategory(val) {
    return ApiService.post("/reports/create-cate-reports", val);
  }

  function editReportCategory(val) {
    return ApiService.post("/reports/update-cate-reports", val);
  }

  function deleteReportCategory(id) {
    return ApiService.post("/reports/delete-cate-reports", id);
  }

  function changeReportCategoryStatus(val) {
    return ApiService.post("/reports/publish-cate-reports", val);
  }

  // END REPORT CATEGORY

  // START REPORT
  function getAllReport(params?: any) {
    return ApiService.query("/reports/get-all-report", params)
      .then(({ data }) => {
        setReport(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function createReport(val) {
    return ApiService.post("/reports/create-report", val);
  }

  function editReport(val) {
    return ApiService.post("/reports/update-report", val);
  }

  function deleteReport(id) {
    return ApiService.post("/reports/delete-report", id);
  }

  function changeReportStatus(val) {
    return ApiService.post("/reports/publish-report", val);
  }

  function updateNewsOrderId(val) {
    return ApiService.post("/news/update-order-id", val);
  }

  // END REPORT

  return {
    reportCategoryList,
    reportList,
    errors,
    getAllReportCategory,
    deleteReportCategory,
    createReportCategory,
    editReportCategory,
    changeReportCategoryStatus,
    getAllReport,
    deleteReport,
    createReport,
    editReport,
    updateNewsOrderId,
    changeReportStatus,
  };
});
