import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useBanner = defineStore("banner", () => {
  const bannerList = ref([]);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setBannerList(data) {
    bannerList.value = data;
  }

  function getBannerList(params) {
    return ApiService.query("/banners/get-all-banners", params)
      .then(({ data }) => {
        setBannerList(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function createBanner(val) {
    return ApiService.post("/banners/create-banner", val);
  }

  function editBanner(val) {
    return ApiService.post("/banners/update-banner", val);
  }

  function deleteBanner(id) {
    return ApiService.post("/banners/delete-banner", id);
  }

  function updateBannerOrderId(val) {
    return ApiService.post("/banners/update-order-id", val);
  }

  function changeStatus(val) {
    return ApiService.post("/banners/publish-banner", val);
  }

  return {
    bannerList,
    errors,
    getBannerList,
    createBanner,
    editBanner,
    deleteBanner,
    updateBannerOrderId,
    changeStatus,
  };
});
