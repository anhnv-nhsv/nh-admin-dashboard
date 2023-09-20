<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column">
        <div class="col-md-6 d-flex align-items-center position-relative my-1">
          <el-select
            placeholder="Status"
            size="large"
            v-model="formSearchData.publish"
            @change="submitSearch"
          >
            <el-option :label="translate('all')" value />
            <el-option :label="translate('enable')" value="1" />
            <el-option :label="translate('disable')" value="0" />
          </el-select>
        </div>
      </div>
      <div class="card-toolbar">
        <button
          v-if="isRearrange"
          type="button"
          class="btn btn-success me-3"
          @click="updateBannerOrderId"
        >
          <KTIcon
            icon-name="arrows-circle"
            icon-type="solid"
            icon-class="fs-2"
          />
          {{ translate("rearrange") }}
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_banner_modal"
          @click="addBanner"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          {{ translate("addBtn") }}
        </button>
      </div>
    </div>
    <div class="card-body pt-0">
      <NHDatatable
        :table-header="tableHeader"
        :table-data="bannerList"
        :loading="loading"
        :show-overflow-tooltip="true"
        draggable
        @on-drag-end="handleDragEnd"
      >
        <template v-slot:indexColumn>
          <el-table-column
            header-align="center"
            class-name="text-center draggable"
            width="55"
            label="#"
          >
            <template #default>
              <KTIcon
                icon-name="abstract-14"
                icon-type="solid"
                icon-class="fs-4 me-1"
              />
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            class-name="text-center"
            :label="translate('index')"
            type="index"
            width="80"
          />
        </template>
        <template v-slot:image="{ row }">
          <img :src="row.image" :alt="row.image" class="table-img" />
        </template>
        <template v-slot:link="{ row }">
          <a :href="row.link" target="_blank">{{ row.link }}</a>
        </template>
        <template v-slot:publish="{ row }">
          <span v-if="row.publish === 1">
            <i class="bi bi-check-circle-fill text-success"></i>
          </span>
          <span v-if="row.publish !== 1">
            <i class="bi bi-x-circle-fill text-danger"></i>
          </span>
        </template>
        <template v-slot:actionColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            :label="translate('action')"
          >
            <template #default="scope">
              <el-button
                size="small"
                type="default"
                data-bs-toggle="modal"
                data-bs-target="#kt_banner_modal"
                @click.prevent="editBanner(scope.row)"
              >
                {{ translate("editBtn") }}
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.prevent="deleteBanner(scope.row)"
              >
                {{ translate("deleteBtn") }}
              </el-button>
              <el-button
                size="small"
                type="default"
                @click.prevent="handleChangeStatus(scope.row)"
              >
                {{ translate("changeStatus") }}
              </el-button>
            </template>
          </el-table-column>
        </template>
      </NHDatatable>
    </div>
  </div>
  <BannerManagementModal
    :action="bannerAction"
    :data="bannerFormData"
    @on-close="handleCloseModal"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import BannerManagementModal from "@/components/modals/forms/BannerManagementModal.vue";
import { useBanner } from "@/stores/banner";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { translate } from "@/core/helpers/i18n-translate";

export default defineComponent({
  name: "banner-management",
  components: {
    BannerManagementModal,
    NHDatatable,
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
          publish: publish,
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
      BannerManagementModal,
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
