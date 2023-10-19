<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column">
        <form class="form row" autoComplete="on" @submit.prevent="submitSearch">
          <div
            class="col-md-4 d-flex align-items-center position-relative my-1"
          >
            <el-input
              autofocus
              v-model="formSearchData.name"
              size="large"
              :placeholder="translate('searchInput')"
              clearable
              :prefix-icon="Search"
              @submit.prevent="submitSearch"
            />
          </div>
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <el-cascader
              :placeholder="translate('category')"
              v-model="formSearchData.parentCategory"
              :options="parents"
              :teleported="false"
              :props="cascaderConfig"
              clearable
              filterable
              style="width: 100%"
              size="large"
              @change="handleChangeReport"
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
              <el-option :label="translate('all')" value />
              <el-option :label="translate('enable')" value="1" />
              <el-option :label="translate('disable')" value="0" />
            </el-select>
          </div>
          <div
            class="col-md-2 d-flex align-items-center position-relative my-1"
          >
            <button
              :data-kt-indicator="false ? 'on' : null"
              type="submit"
              class="btn btn-primary"
            >
              <span v-if="true" class="indicator-label">{{
                translate("search")
              }}</span>
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
            data-bs-target="#kt_report_modal"
            @click="addCategory"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("addReport") }}
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
            type="selection"
            width="55"
          />
        </template>
        <template v-slot:category="{ row }">
          <div>
            {{
              reportCategories?.find((item) => item.id === row.category_id)
                ?.name
            }}
          </div>
        </template>
        <template v-slot:date_report="{ row }">
          <div v-if="row.date_report">
            {{ formatDate(row.date_report) }}
          </div>
          <div v-if="row.date_report === undefined">-</div>
        </template>
        <template v-slot:name="{ row }">
          <div class="left-name">{{ row.name }}</div>
        </template>
        <template v-slot:actionColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            :label="translate('action')"
            width="300"
          >
            <template #default="scope">
              <div class="change-status">
                <el-button
                  size="small"
                  type="default"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_report_modal"
                  @click.prevent="editCategory(scope.row)"
                >
                  {{ translate("editBtn") }}
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click.prevent="deleteCategory(scope.row)"
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
  <ReportActionModal
    :action="reportCateAction"
    :data="rowDetail"
    :reportCategories="reportCategories"
    @submitSearch="submitSearch"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { translate } from "@/core/helpers/i18n-translate";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useReport } from "@/stores/report";
import qs from "qs";
import ReportActionModal from "@/components/modals/forms/ReportActionModal.vue";

const value = ref("");
const visible = ref(false);
const parents = ref();
const reportCategories = ref();
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "report-list",
  components: {
    ReportActionModal,
    NHDatatable,
  },
  setup() {
    const store = useReport();
    const formSearchData = ref({
      name: "",
      publish: "",
      parentCategory: "",
    });
    const data = ref({
      publish: "",
    });
    const tableHeader = ref([
      {
        label: "name",
        prop: "name",
        visible: true,
      },
      {
        label: "category",
        prop: "category",
        visible: true,
      },
      {
        label: "dateReport",
        prop: "date_report",
        visible: true,
      },
      {
        label: "status",
        prop: "publish",
        visible: true,
        width: 100,
      },
    ]);
    let selectedIds = ref(0);
    const idSelect = ref();
    const loading = ref<boolean>(false);
    let dataRequestNewsCategoryManager = ref();
    let reportCateAction = ref("");
    let pagination = ref();
    let rowDetail = ref();
    let syncKLPBtn = ref<HTMLElement | null>(null);
    const rowCheck = ref([]);

    const getAllReportCategory = async (
      pageNo?: number,
      id?: string,
      name?: string,
      publish?: number,
      pageSize = "10"
    ) => {
      loading.value = true;
      await store.getAllReport({
        params: {
          name: name ? name : "",
          category_id: id ? id : "",
          pageNo: pageNo,
          publish: publish,
          pageSize: pageSize,
        },
      });

      const requestNewsCategoryResponse = JSON.parse(
        JSON.stringify(store.reportList)
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
        idSelect.value,
        formData.name,
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
        url: `/bao-cao/${rawVal.slug}.html`,
        publish: rawVal.publish !== 0,
        parent_id: rawVal.parent_id,
        image: rawVal.file,
        image_english: rawVal.file_english,
        image_korea: rawVal.file_korea,
        contentVn: rawVal.content,
        contentEn: rawVal.content_english,
        contentKr: rawVal.content_korea,
        date_report: rawVal.date_report,
        category_id: rawVal.category_id,
        id: rawVal.id,
      };
    };

    const deleteCategory = async (val?: any) => {
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
          const response = await store.deleteReport({ id: val.id });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("successfully"),
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
          const response = await store.deleteReport({ id: arr });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("successfully"),
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

    const handleChangeStatus = async (val?: any) => {
      const Tpublish = JSON.parse(JSON.stringify(val));
      const result = Tpublish.publish === 0 ? 1 : 0;
      const res = await store.changeReportStatus(
        qs.stringify({ id: val.id, publish: result })
      );
      if (res.data.success === true) {
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
          title: res.data.mess,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    function changePage(page) {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllReportCategory(
        page,
        idSelect.value,
        formData.name,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    }

    const changePageSize = (pageSize) => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      pagination.value.pageSize = pageSize;
      getAllReportCategory(
        1,
        idSelect.value,
        formData.name,
        formData.publish ? formData.publish : "",
        pageSize
      );
    };
    const cascaderConfig = {
      expandTrigger: "hover" as const,
      value: "id",
    };

    const handleChangeReport = (value) => {
      const res = JSON.parse(JSON.stringify(value));
      if (res) {
        idSelect.value = res.toString();
      } else {
        idSelect.value = "";
      }
    };

    function buildHierarchy(arr) {
      const hierarchy: any = [];
      // Create a map of id to item and initialize children
      for (const item of arr) {
        item.value = item.name;
        item.label = item.name;
        hierarchy.push(item);
      }

      return hierarchy;
    }

    onMounted(async () => {
      await store.getAllReportCategory({
        params: {
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestCategoryResponse = JSON.parse(
        JSON.stringify(store.reportCategoryList)
      );
      reportCategories.value = requestCategoryResponse.data;
      parents.value = buildHierarchy(requestCategoryResponse.data);
    });

    const formatDate = (val) => {
      const date = new Date(val);
      const dateObject = new Date(date);

      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");

      const desiredDateString = `${year}-${month}-${day}`;

      return desiredDateString;
    };

    onBeforeMount(() => {
      getAllReportCategory(1);
    });

    return {
      dataRequestNewsCategoryManager,
      data,
      selectedIds,
      parents,
      userRole,
      syncKLPBtn,
      cascaderConfig,
      visible,
      tableHeader,
      pagination,
      loading,
      formSearchData,
      syncPayload,
      value,
      reportCateAction,
      rowDetail,
      reportCategories,
      Search,
      formatDate,
      handleChangeReport,
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
      translate,
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
