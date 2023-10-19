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
            class="col-md-2 d-flex align-items-center position-relative my-1"
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
            class="col-md-2 d-flex align-items-center position-relative my-1"
          >
            <el-date-picker
              v-model="formSearchData.date_news"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :teleported="false"
              :editable="false"
              :placeholder="translate('reportDate')"
              size="large"
            />
          </div>
          <div
            class="col-md-2 d-flex align-items-center position-relative my-1"
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
            data-bs-target="#kt_news_modal"
            @click="addCategory"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("addNews") }}
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
        :table-data="dataRequestNewsListManager"
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
        <template v-slot:name="{ row }">
          <div class="left-name">{{ row.name }}</div>
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
                data-bs-target="#kt_news_modal"
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
            </template>
          </el-table-column>
        </template>
        <template v-slot:category_name="{ row }">
          <div>
            {{ nameCate?.find((item) => item.id === row.category_id)?.name }}
          </div>
        </template>
        <template v-slot:time_post="{ row }">
          <div v-if="row.time_post">
            {{ formatDate(row.time_post) }}
          </div>
          <div v-if="row.time_post === undefined">-</div>
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
  <NewsModal
    :action="newsAction"
    :rowDetail="rowDetail"
    @submitSearch="submitSearch"
    :abc="abc"
    :nameCate="nameCate"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { translate } from "@/core/helpers/i18n-translate";
import { Search } from "@element-plus/icons-vue";
import { useNewsListStore } from "@/stores/news-list";
import { useNewsStore } from "@/stores/news-category";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import NewsModal from "@/components/modals/forms/NewsModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";

const value = ref("");
const visible = ref(false);
let userRole = ref("all");
const parents = ref();
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "news-listing",
  components: {
    NewsModal,
    NHDatatable,
  },
  setup() {
    const store = useNewsListStore();
    const storeCate = useNewsStore();
    const formSearchData = ref({
      name: "",
      publish: "",
      parentCategory: "",
      date_news: "",
    });
    const data = ref({
      publish: "",
    });
    const tableHeader = ref([
      {
        label: "postName",
        prop: "name",
        visible: true,
      },
      {
        label: "categoryName",
        prop: "category_name",
        visible: true,
        width: 240,
      },
      {
        label: "postingTime",
        prop: "time_post",
        visible: true,
        width: 150,
      },
      {
        label: "status",
        prop: "publish",
        visible: true,
        width: 120,
      },
    ]);
    let selectedIds = ref(0);
    const loading = ref<boolean>(false);
    let dataRequestNewsListManager = ref();
    let newsAction = ref("");
    const idSelect = ref();
    let pagination = ref();
    let rowDetail = ref();
    let abc = ref();
    let nameCate = ref();
    let syncKLPBtn = ref<HTMLElement | null>(null);
    const rowCheck = ref([]);

    async function getAllNewsManager(
      pageNo?: number,
      id?: string,
      date?: string,
      name?: string,
      publish?: string,
      pageSize = "10"
    ) {
      loading.value = true;
      await store.getAllNewsList({
        params: {
          name: name ? name : "",
          category_id: id ? id : "",
          time_post: date ? date + "%" : "",
          publish: publish ? publish : "",
          pageNo: pageNo,
          pageSize: pageSize,
        },
      });

      const requestNewsListResponse = JSON.parse(
        JSON.stringify(store.allNewListResp)
      );

      dataRequestNewsListManager.value = requestNewsListResponse.data;
      pagination.value = {
        totalPages: requestNewsListResponse.totalPages,
        pageNo: requestNewsListResponse.pageNo,
        pageSize: requestNewsListResponse.pageSize,
        totalCount: requestNewsListResponse.totalCount,
        currentCount: requestNewsListResponse.currentCount,
      };
      loading.value = false;
    }

    function submitSearch() {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllNewsManager(
        1,
        idSelect.value,
        formData.date_news,
        formData.name,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    }
    const handleSingleSelection = (val) => {
      selectedIds.value += 1;
    };

    const handleMultipleSelection = (val) => {
      selectedIds.value = val.length;
      rowCheck.value = JSON.parse(JSON.stringify(val));
    };

    const addCategory = async () => {
      newsAction.value = "add";
      rowDetail.value = {};
      await store.getAllNewsList({
        params: {
          name: "",
          publish: "",
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestNewsListResponse = JSON.parse(
        JSON.stringify(store.allNewListResp)
      );

      abc.value = requestNewsListResponse;
    };

    const editCategory = async (val?: object | undefined) => {
      newsAction.value = "edit";
      rowDetail.value = JSON.parse(JSON.stringify(val));
      await store.getAllNewsList({
        params: {
          name: "",
          publish: "",
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestNewsListResponse = JSON.parse(
        JSON.stringify(store.allNewListResp)
      );

      abc.value = requestNewsListResponse;
    };

    const deleteCategory = (val?: any) => {
      Swal.fire({
        title: translate("confirmation"),
        text: translate("deleteWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await store.deleteNewsList({ id: val.id });
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
          const response = await store.deleteNewsList({ id: arr });
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

    function changePage(page) {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllNewsManager(
        page,
        idSelect.value,
        formData.date_news,
        formData.name,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    }

    const changePageSize = (pageSize) => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      pagination.value.pageSize = pageSize;
      getAllNewsManager(
        1,
        idSelect.value,
        formData.date_news,
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

    onMounted(() => {
      async function getRequestNewsCategoryManager(
        pageNo?: number,
        name?: string,
        publish?: string,
        pageSize = "1000"
      ) {
        loading.value = true;
        await storeCate.getAllNewsCategory({
          params: {
            name: name ? name : "",
            publish: publish ? publish : "",
            pageNo: pageNo,
            pageSize: pageSize,
          },
        });

        const requestNewsCategoryResponse = JSON.parse(
          JSON.stringify(storeCate.allNewCategoryResp)
        );

        nameCate.value = requestNewsCategoryResponse.data;
        parents.value = buildHierarchy(requestNewsCategoryResponse.data);

        loading.value = false;
      }

      getRequestNewsCategoryManager();
    });

    const formatDate = (val) => {
      if (val) {
        const dateObject = new Date(val);
        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 to month because months are zero-indexed
        const day = dateObject.getDate().toString().padStart(2, "0");

        return year + "-" + month + "-" + day;
      } else {
        return "-";
      }
    };

    onBeforeMount(() => {
      getAllNewsManager(1);
    });
    return {
      dataRequestNewsListManager,
      parents,
      cascaderConfig,
      nameCate,
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
      handleChangeReport,
      addCategory,
      formatDate,
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
