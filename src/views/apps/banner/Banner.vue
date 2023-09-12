<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column">
        <form class="form row" autoComplete="on" @submit.prevent="submitSearch">
          <div
            class="col-md-6 d-flex align-items-center position-relative my-1"
          >
            <el-input
              autofocus
              v-model="formSearchData.name"
              size="large"
              placeholder="Press enter to search"
              clearable
              :prefix-icon="Search"
              @submit.prevent="submitSearch"
            />
          </div>
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <el-select
              placeholder="Status"
              size="large"
              v-model="formSearchData.publish"
            >
              <el-option label="All" />
              <el-option label="Enable" value="1" />
              <el-option label="Disable" value="0" />
            </el-select>
          </div>
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <button
              :data-kt-indicator="false ? 'on' : null"
              type="submit"
              class="btn btn-primary"
            >
              <span v-if="true" class="indicator-label">Search</span>
              <span v-if="false" class="indicator-progress"
                >Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span
              ></span>
            </button>
          </div>
        </form>
      </div>
      <div class="card-toolbar">
        <div
          v-if="selectedIds === 0"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_banner_category_modal"
            @click="addCategory"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Page
          </button>
        </div>
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="w-auto me-5">
            <button
              type="button"
              class="btn btn-success"
              @click="handleChangeStatus()"
            >
              Change status
            </button>
          </div>
          <div class="w-auto">
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteCategory()"
            >
              Delete {{ selectedIds }} selected
            </button>
          </div>
        </div>
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-customer-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-customer-table-select="delete_selected"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <NHDatatable
        :table-header="tableHeader"
        :table-data="contactArray"
        :pagination="pagination"
        :user-role="userRole"
        :loading="loading"
        :show-overflow-tooltip="true"
        draggable
        @change-page="changePage"
        @change-page-size="changePageSize"
        @single-select="handleSingleSelection"
        @multiple-select="handleMultipleSelection"
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
              <KTIcon icon-name="abstract-14" icon-type="solid" icon-class="fs-4 me-1" />
            </template>
          </el-table-column>
        </template>
        <template v-slot:uriPage="{ row }">
          <img :src="row.uriPage" :alt="row.namePost" class="table-img" />
        </template>
        <template v-slot:url="{ row }">
          <a :href="row.url" target="_blank">{{ row.url }}</a>
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
                @click.prevent="editCategory(scope.row)"
              >
                Edit
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.prevent="deleteCategory(scope.row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </template>
      </NHDatatable>
    </div>
  </div>
  <BannerManagementModal :action="newsAction" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import { contactArray, options, selectTask } from "./mock/index";
import BannerManagementModal from "@/components/modals/forms/BannerManagementModal.vue";

const value = ref("");
const visible = ref(false);
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "banner-management",
  components: {
    BannerManagementModal,
    NHDatatable,
  },
  setup() {
    const formSearchData = ref({
      name: "",
      publish: "",
    });
    const data = ref({
      publish: "",
    });
    const tableHeader = ref([
      {
        label: "Tên",
        prop: "namePost",
        visible: true,
      },
      {
        label: "Hình ảnh",
        prop: "uriPage",
        visible: true,
      },
      {
        label: "URL",
        prop: "url",
        visible: true,
      },
      {
        label: "Trạng thái",
        width: 140,
        prop: "",
        visible: true,
      },
    ]);
    let selectedIds = ref(0);
    const loading = ref<boolean>(false);
    let dataRequestStatistics = ref();
    let newsAction = ref("");
    let pagination = ref();

    const handleApplyStatus = () => {};
    const handleChangeStatus = () => {};

    function submitSearch() {}
    const handleSingleSelection = (val) => {
      selectedIds.value += 1;
    };

    const handleMultipleSelection = (val) => {
      selectedIds.value = val.length;
    };

    const addCategory = () => {
      newsAction.value = "add";
      console.log("add category");
    };

    const editCategory = (val?: object | undefined) => {
      newsAction.value = "edit";
      console.log("edit category: ", val);
    };

    const deleteCategory = (val?: object | undefined) => {};

    function changePage(page) {}

    const changePageSize = (pageSize) => {};

    const handleDragEnd = (data) => {
      for (let i = 0; i < data.newTableData.length; i++) {
        data.newTableData[i].orderId = i + 1;
      }
      console.log(data.newTableData);
    };

    return {
      dataRequestStatistics,
      data,
      userRole,
      visible,
      selectedIds,
      options,
      tableHeader,
      pagination,
      loading,
      formSearchData,
      selectTask,
      syncPayload,
      newsAction,
      value,
      Search,
      contactArray,
      BannerManagementModal,
      addCategory,
      handleChangeStatus,
      deleteCategory,
      editCategory,
      handleApplyStatus,
      handleSingleSelection,
      handleMultipleSelection,
      changePage,
      changePageSize,
      submitSearch,
      handleDragEnd,
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
