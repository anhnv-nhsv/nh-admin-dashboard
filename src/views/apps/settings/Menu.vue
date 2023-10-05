<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column">
        <div class="col-md-8 d-flex align-items-center position-relative my-1">
          <el-select
            placeholder="Status"
            size="large"
            v-model="formSearchData.publish"
            @change="submitSearch"
          >
            <el-option :label="translate('select')" value />
            <el-option :label="translate('menuTopVi')" value="1" />
            <el-option :label="translate('menuTopEn')" value="2" />
            <el-option :label="translate('menuTopKr')" value="3" />
            <el-option :label="translate('menuBannerVi')" value="4" />
            <el-option :label="translate('menuBannerEn')" value="5" />
            <el-option :label="translate('menuBannerKr')" value="6" />
            <el-option :label="translate('openAcc')" value="7" />
            <el-option :label="translate('menuVertical')" value="8" />
          </el-select>
        </div>
      </div>
      <div class="card-toolbar">
        <button
          type="button"
          class="btn btn-primary mb-4"
          data-bs-toggle="modal"
          data-bs-target="#kt_menu_modal"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          {{ translate("addBtn") }}
        </button>
      </div>
    </div>
    <div class="my-4 px-10">
      <div class="row">
        <div class="col-4">
          <div class="demo-collapse">
            <el-collapse accordion v-model="formSearchData.activeNames">
              <el-collapse-item title="Tùy chỉnh liên kết">
                <el-form ref="ruleFormRef" :model="formSearchData">
                  <el-form-item :label="translate('url')">
                    <el-input
                      v-model="formSearchData.url"
                      :placeholder="translate('url')"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item :label="translate('title')">
                    <el-input
                      v-model="formSearchData.title"
                      :placeholder="translate('title')"
                      clearable
                    />
                  </el-form-item>
                </el-form>
                <button class="btn btn-sm btn-primary" type="submit">
                  <span v-if="true" class="indicator-label">
                    {{ translate("addBtn") }}
                    <span class="svg-icon svg-icon-3 ms-2 me-0">
                      <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
                    </span>
                  </span>
                  <span v-if="false" class="indicator-progress">
                    Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="col-8">xcvxcv</div>
      </div>
    </div>
  </div>
  <MenuModal
    :action="bannerAction"
    :data="bannerFormData"
    @on-close="handleCloseModal"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import MenuModal from "@/components/modals/forms/MenuModal.vue";
import { useBanner } from "@/stores/banner";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { translate } from "@/core/helpers/i18n-translate";

export default defineComponent({
  name: "menu-management",
  components: {
    MenuModal,
  },
  setup() {
    const store = useBanner();
    const tableHeader = ref([
      {
        label: "name",
        width: 200,
        prop: "name",
        visible: true,
      },
      {
        label: "image",
        width: 200,
        prop: "image",
        visible: true,
      },
      {
        label: "url",
        prop: "link",
        visible: true,
      },
      {
        label: "status",
        width: 120,
        prop: "publish",
        visible: true,
      },
    ]);
    const loading = ref<boolean>(false);
    const isRearrange = ref<boolean>(false);
    const bannerAction = ref("");
    const bannerFormData = ref({});
    const bannerList = ref([]);
    const newTableData = ref<any>([]);
    const formSearchData = ref({
      publish: "",
      activeNames: ["1"],
      url: "",
      title: "",
    });

    const handleApplyStatus = () => {};
    const handleChangeStatus = async (val?: any) => {
      const Tpublish = JSON.parse(JSON.stringify(val));
      const result = Tpublish.publish === 0 ? 1 : 0;
      const oke = await store.changeStatus({ id: val.id, publish: result });
      if (oke.data.success === true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: translate("successfully"),
          showConfirmButton: false,
          timer: 1500,
        });
        submitSearch();
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: oke.data.mess,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    const getAllBanner = async (
      pageNo?: number,
      publish?: string,
      pageSize = 1000
    ) => {
      loading.value = true;
      await store.getBannerList({
        params: {
          pageNo: pageNo,
          pageSize: pageSize,
          menu: publish,
        },
      });
      const response = JSON.parse(JSON.stringify(store.bannerList));
      bannerList.value = response.data;
      loading.value = false;
    };

    onBeforeMount(() => {
      getAllBanner(1);
    });

    const submitSearch = () => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllBanner(1, formData.publish ? formData.publish : "");
    };

    const addBanner = () => {
      bannerAction.value = "add";
      bannerFormData.value = {
        name: "",
        attachUrl: "",
        imageUrl: "",
        content: "",
        isPublish: false,
      };
    };

    const editBanner = (val?: object | undefined) => {
      bannerAction.value = "edit";
      const row = JSON.parse(JSON.stringify(val));
      bannerFormData.value = {
        id: row.id,
        name: row.name,
        attachUrl: row.link,
        imageUrl: row.image,
        content: row.content,
        isPublish: row.publish,
      };
    };

    const deleteBanner = (val) => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      Swal.fire({
        title: translate("confirmation"),
        text: translate("deleteWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: translate("deleteBtn"),
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await store.deleteBanner({ id: val.id });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("successfully"),
              showConfirmButton: false,
              timer: 1000,
            });
            await getAllBanner(1, formData.publish ? formData.publish : "");
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: response.data.mess,
              showConfirmButton: false,
              timer: 1000,
            });
          }
        }
      });
    };

    const handleDragEnd = (data) => {
      // if (JSON.parse(JSON.stringify(bannerList.value)) == data.newTableData) {
      //   isRearrange.value = false;
      // } else {
      //   isRearrange.value = true;
      // }
      isRearrange.value = true;
      for (let i = 0; i < data.newTableData.length; i++) {
        data.newTableData[i].orderId = i + 1;
      }
      newTableData.value = data.newTableData;
    };

    const updateBannerOrderId = async () => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      Swal.fire({
        title: translate("confirmation"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: translate("submitBtn"),
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-secondary",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const payload = newTableData.value.map((e) => {
            return {
              id: e.id,
              orderId: e.orderId,
            };
          });
          const params = new URLSearchParams();
          params.append("data", JSON.stringify(payload));
          const response = await store.updateBannerOrderId(params);
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("successfully"),
              showConfirmButton: false,
              timer: 1000,
            });
            isRearrange.value = false;
            await getAllBanner(1, formData.publish ? formData.publish : "");
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: response.data.mess,
              showConfirmButton: false,
              timer: 1000,
            });
          }
        }
      });
    };

    const handleCloseModal = () => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllBanner(1, formData.publish ? formData.publish : "");
    };

    return {
      bannerList,
      tableHeader,
      loading,
      bannerAction,
      isRearrange,
      bannerFormData,
      formSearchData,
      Search,
      MenuModal,
      addBanner,
      submitSearch,
      handleChangeStatus,
      deleteBanner,
      editBanner,
      handleApplyStatus,
      handleDragEnd,
      updateBannerOrderId,
      handleCloseModal,
      translate,
    };
  },
});
</script>

<style scoped>
.del-btn {
  padding: 14px 15px;
}

.table-img {
  width: 100%;
  border-radius: 8px;
  position: relative;
  object-fit: contain;
}

.card-title {
  width: 100%;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.action-right {
  flex: 1;
}

.search-page {
  flex-flow: row;
}

.dialog-footer button:first-child {
  margin-right: 0;
}

.btn-add {
  position: relative;
  left: 24px;
}

.wrapper-header {
  flex-flow: row;
}
</style>
