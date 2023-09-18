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
            <el-option label="All" value />
            <el-option label="Enable" value="1" />
            <el-option label="Disable" value="0" />
          </el-select>
        </div>
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
            data-bs-target="#kt_report_category_modal"
            @click="addCategory"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Category
          </button>
        </div>
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="w-auto">
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteMutiRow()"
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
        :table-data="dataRequestNewsCategoryManager"
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
            label="STT"
            type="index"
            width="55"
          />
        </template>
        <template v-slot:name="{ row }">
          <div class="left-name">{{ row.name }}</div>
        </template>
        <template v-slot:actionColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            label="Thao tác"
            width="300"
          >
            <template #default="scope">
              <div class="change-status">
                <el-button
                  size="small"
                  type="default"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_report_category_modal"
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
                <el-button
                  size="small"
                  type="default"
                  @click.prevent="handleChangeStatus(scope.row)"
                >
                  Change status
                </el-button>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:publish="{ row }">
          <span v-if="row.publish === 1">
            <i class="bi bi-check-circle-fill text-success"></i
          ></span>
          <span v-if="row.publish !== 1"
            ><i class="bi bi-x-circle-fill text-danger"></i
          ></span>
        </template>
      </NHDatatable>
    </div>
  </div>
  <ReportCategoryActionModal
    :action="reportCateAction"
    :data="rowDetail"
    @submitSearch="submitSearch"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useReport } from "@/stores/report";
import qs from "qs";
import ReportCategoryActionModal from "@/components/modals/forms/ReportCategoryActionModal.vue";

const value = ref("");
const visible = ref(false);
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "report-category",
  components: {
    ReportCategoryActionModal,
    NHDatatable,
  },
  setup() {
    const store = useReport();
    const formSearchData = ref({
      publish: "",
    });
    const data = ref({
      publish: "",
    });
    const tableHeader = ref([
      {
        label: "Tên danh mục",
        prop: "name",
        visible: true,
      },
      {
        label: "Đường dẫn",
        prop: "slug",
        visible: true,
      },
      {
        label: "Trạng thái",
        prop: "publish",
        visible: true,
        width: 100,
      },
    ]);
    let selectedIds = ref(0);
    const loading = ref<boolean>(false);
    let dataRequestNewsCategoryManager = ref();
    let reportCateAction = ref("");
    let pagination = ref();
    let rowDetail = ref();
    let syncKLPBtn = ref<HTMLElement | null>(null);
    const rowCheck = ref([]);

    const getAllReportCategory = async (
      pageNo?: number,
      publish?: number,
      pageSize = "10"
    ) => {
      loading.value = true;
      await store.getAllReportCategory({
        params: {
          pageNo: pageNo,
          publish: publish,
          pageSize: pageSize,
        },
      });

      const requestNewsCategoryResponse = JSON.parse(
        JSON.stringify(store.reportCategoryList)
      );

      dataRequestNewsCategoryManager.value = requestNewsCategoryResponse.data;
      pagination.value = {
        totalPages: requestNewsCategoryResponse.totalPages,
        pageNo: requestNewsCategoryResponse.pageNo,
        pageSize: requestNewsCategoryResponse.pageSize,
        totalCount: requestNewsCategoryResponse.totalCount,
        currentCount: requestNewsCategoryResponse.currentCount,
      };
      loading.value = false;
    };

    const submitSearch = () => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllReportCategory(
        1,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    };

    const handleSingleSelection = (val) => {
      selectedIds.value += 1;
    };

    const handleMultipleSelection = (val) => {
      selectedIds.value = val.length;
      rowCheck.value = JSON.parse(JSON.stringify(val));
    };

    const addCategory = () => {
      reportCateAction.value = "add";
      rowDetail.value = {};
    };

    const editCategory = (val?: object | undefined) => {
      reportCateAction.value = "edit";
      const rawVal = JSON.parse(JSON.stringify(val));
      rowDetail.value = {
        titleVn: rawVal.name,
        titleEn: rawVal.name_english,
        titleKr: rawVal.name_korea,
        url: `/danh-muc-bao-cao/${rawVal.slug}.html`,
        publish: rawVal.publish !== 0,
        parent_id: rawVal.parent_id,
        id: rawVal.id,
      };
    };

    const deleteCategory = async (val?: any) => {
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
          const response = await store.deleteReportCategory({ id: val.id });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Success!",
              showConfirmButton: false,
              timer: 1000,
            });
            submitSearch();
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

    const deleteMutiRow = async () => {
      let arr: any = [];
      const change = JSON.parse(JSON.stringify(rowCheck.value));
      for (const item of change) {
        arr.push(item.id);
      }

      const oke = await store.deleteReportCategory(qs.stringify({ id: arr }));
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

    const handleChangeStatus = async (val?: any) => {
      console.log(JSON.parse(JSON.stringify(val)));
      const Tpublish = JSON.parse(JSON.stringify(val));
      const result = Tpublish.publish === 0 ? 1 : 0;
      const oke = await store.changeReportCategoryStatus(
        qs.stringify({ id: val.id, publish: result })
      );
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

    function changePage(page) {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllReportCategory(
        page,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    }

    const changePageSize = (pageSize) => {
      console.log("changePageSize");
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      pagination.value.pageSize = pageSize;
      getAllReportCategory(
        1,
        formData.publish ? formData.publish : "",
        pageSize
      );
    };

    onBeforeMount(() => {
      getAllReportCategory(1);
    });

    return {
      dataRequestNewsCategoryManager,
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
      reportCateAction,
      rowDetail,
      Search,
      addCategory,
      editCategory,
      deleteCategory,
      deleteMutiRow,
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
.del-btn {
  padding: 14px 15px;
}

.my-header {
  display: flex;
  justify-content: space-between;
}

.left-name {
  text-align: left;
}

.action-right {
  flex: 1;
}

.search-page {
  flex-flow: row;
}

.change-status {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
