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
            data-bs-target="#kt_page_modal"
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
        ref="myTable"
        :table-header="tableHeader"
        :table-data="dataRequestPageManager"
        :pagination="pagination"
        :enable-items-per-page-dropdown="true"
        userRole="all"
        :loading="loading"
        @change-page="changePage"
        @change-page-size="changePageSize"
        @single-select="handleSingleSelection"
        @multiple-select="handleMultipleSelection"
      >
        <template v-slot:indexColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            type="selection"
            width="55"
          />
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
                data-bs-target="#kt_page_modal"
                @click.prevent="editCategory(scope.row)"
              >
                Edit
              </el-button>
              <el-popconfirm
                title="Are you sure to delete this?"
                icon-color="#626AEF"
                hide-after="10"
                @confirm="deleteCategory(scope.row)"
              >
                <template #reference>
                  <el-button size="small" type="danger">Delete</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </template>
        <template v-slot:publish="{ row }">
          <span v-if="row.publish === 1">
            <i class="bi bi-check-circle-fill v-btn"></i
          ></span>
          <span v-if="row.publish !== 1"
            ><i class="bi bi-x-circle-fill x-btn"></i
          ></span>
        </template>
      </NHDatatable>
    </div>
  </div>
  <PageManagementModal
    :action="newsAction"
    :rowDetail="rowDetail"
    @submitSearch="submitSearch"
    :abc="abc"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { usePageStore } from "@/stores/page";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import PageManagementModal from "@/components/modals/forms/PageManagementModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";

const value = ref("");
const visible = ref(false);
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "page-management",
  components: {
    PageManagementModal,
    NHDatatable,
  },
  setup() {
    const store = usePageStore();
    const formSearchData = ref({
      name: "",
      publish: "",
    });
    const data = ref({
      publish: "",
    });
    const tableHeader = ref([
      {
        label: "ID",
        prop: "id",
        visible: true,
        width: 70,
      },
      {
        label: "Parent",
        prop: "parent_id",
        visible: true,
      },
      {
        label: "Tên",
        prop: "name",
        visible: true,
      },
      {
        label: "Trạng thái",
        prop: "publish",
        visible: true,
      },
    ]);
    let selectedIds = ref(0);
    const loading = ref<boolean>(false);
    let dataRequestPageManager = ref();
    let newsAction = ref("");
    let pagination = ref();
    let rowDetail = ref();
    let abc = ref();
    let syncKLPBtn = ref<HTMLElement | null>(null);
    const rowCheck = ref([]);

    async function getRequestPageManager(
      pageNo?: number,
      name?: string,
      publish?: string,
      pageSize = "10"
    ) {
      loading.value = true;
      await store.getAllPages({
        params: {
          name: name ? name : "",
          publish: publish ? publish : "",
          pageNo: pageNo,
          pageSize: pageSize,
        },
      });

      const requestPageResponse = JSON.parse(
        JSON.stringify(store.allPagesResp)
      );

      dataRequestPageManager.value = requestPageResponse.data;
      pagination.value = {
        totalPages: requestPageResponse.totalPages,
        pageNo: requestPageResponse.pageNo,
        pageSize: requestPageResponse.pageSize,
        totalCount: requestPageResponse.totalCount,
        currentCount: requestPageResponse.currentCount,
      };
      loading.value = false;
    }

    function submitSearch() {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestPageManager(
        1,
        formData.name,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    }
    const handleSingleSelection = (val) => {
      selectedIds.value += 1;
      console.log(`handleSingleSelection: ${val}`);
    };

    const handleMultipleSelection = (val) => {
      selectedIds.value = val.length;
      console.log("handleMultipleSelection :", JSON.parse(JSON.stringify(val)));
      rowCheck.value = JSON.parse(JSON.stringify(val));
    };

    const addCategory = async () => {
      newsAction.value = "add";
      rowDetail.value = {};
      await store.getAllPages({
        params: {
          name: "",
          publish: "",
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestPageResponse = JSON.parse(
        JSON.stringify(store.allPagesResp)
      );

      abc.value = requestPageResponse;
    };

    const editCategory = async (val?: object | undefined) => {
      newsAction.value = "edit";
      console.log("edit", JSON.parse(JSON.stringify(val)));

      rowDetail.value = JSON.parse(JSON.stringify(val));
      await store.getAllPages({
        params: {
          name: "",
          publish: "",
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestPageResponse = JSON.parse(
        JSON.stringify(store.allPagesResp)
      );

      abc.value = requestPageResponse;
    };

    const deleteCategory = async (val?: any) => {
      const oke = await store.deletePage({ id: val.id });
      if (oke.data.success === true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success!",
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

    const handleChangeStatus = (val?: any) => {
      let arr: any = [];
      const change = JSON.parse(JSON.stringify(rowCheck.value));
      for (let item of change) {
        arr.push(item.id.toString());
      }
      console.log("item: ", arr);
    };

    function changePage(page) {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestPageManager(
        page,
        formData.name,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    }

    const changePageSize = (pageSize) => {
      console.log("changePageSize");
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      pagination.value.pageSize = pageSize;
      getRequestPageManager(
        1,
        formData.name,
        formData.publish ? formData.publish : "",
        pageSize
      );
    };

    onBeforeMount(() => {
      getRequestPageManager(1);
    });
    return {
      dataRequestPageManager,
      data,
      selectedIds,
      userRole,
      syncKLPBtn,
      visible,
      tableHeader,
      pagination,
      loading,
      formSearchData,
      syncPayload,
      value,
      newsAction,
      rowDetail,
      Search,
      abc,
      addCategory,
      editCategory,
      deleteCategory,
      handleChangeStatus,
      handleSingleSelection,
      handleMultipleSelection,
      changePage,
      changePageSize,
      submitSearch,
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

.v-btn {
  font-size: 15px;
  color: green;
}
.x-btn {
  font-size: 15px;
  color: red;
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
