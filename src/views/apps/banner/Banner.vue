<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column"></div>
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
          Rearrange
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_banner_category_modal"
          @click="addBanner"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          Add banner
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
            label="STT"
            type="index"
            width="55"
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
            label="Thao tác"
          >
            <template #default="scope">
              <el-button
                size="small"
                type="default"
                data-bs-toggle="modal"
                data-bs-target="#kt_banner_category_modal"
                @click.prevent="editBanner(scope.row)"
              >
                Edit
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.prevent="deleteBanner(scope.row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </template>
      </NHDatatable>
    </div>
  </div>
  <BannerManagementModal :action="bannerAction" :data="bannerFormData" @on-close="handleCloseModal" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import BannerManagementModal from "@/components/modals/forms/BannerManagementModal.vue";
import { useBanner } from "@/stores/banner";
import Swal from "sweetalert2/dist/sweetalert2.js";

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
        label: "Tên",
        prop: "name",
        visible: true,
      },
      {
        label: "Hình ảnh",
        prop: "image",
        visible: true,
      },
      {
        label: "URL",
        prop: "link",
        visible: true,
      },
      {
        label: "Trạng thái",
        width: 140,
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

    const handleApplyStatus = () => {};
    const handleChangeStatus = () => {};

    const getAllBanner = async (pageNo?: number, pageSize = 1000) => {
      loading.value = true;
      await store.getBannerList({
        params: {
          pageNo: pageNo,
          pageSize: pageSize,
        },
      });
      const response = JSON.parse(JSON.stringify(store.bannerList));
      bannerList.value = response.data;
      loading.value = false;
    };

    onBeforeMount(() => {
      getAllBanner(1);
    });

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
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
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
              title: "Success!",
              showConfirmButton: false,
              timer: 1500,
            });
            await getAllBanner(1);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: response.data.mess,
              showConfirmButton: false,
              timer: 1500,
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
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirm",
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
              title: "Success!",
              showConfirmButton: false,
              timer: 1500,
            });
            isRearrange.value = false;
            await getAllBanner(1);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: response.data.mess,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      });
    };

    const handleCloseModal = () => {
      getAllBanner(1);
    };

    return {
      bannerList,
      tableHeader,
      loading,
      bannerAction,
      isRearrange,
      bannerFormData,
      Search,
      BannerManagementModal,
      addBanner,
      handleChangeStatus,
      deleteBanner,
      editBanner,
      handleApplyStatus,
      handleDragEnd,
      updateBannerOrderId,
      handleCloseModal,
    };
  },
});
</script>

<style scoped>
.btn {
  padding: 6px 20px !important;
}

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
