<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <div class="table-responsive">
      <table
        class="
          table table-striped table-bordered
          border
          align-middle
          fs-6
          gy-5
          dataTable
          no-footer
        "
        id="kt_customers_table"
        role="grid"
      >
        <!--begin::Table head-->
        <thead style="background-color: #ffc342">
          <!--begin::Table row-->
          <tr
            class="text-center text-gray-800 fw-bolder fs-7 text-uppercase gs-0"
            role="row"
          >
            <template v-for="(cell, i) in tableHeader" :key="i">
              <th
                :class="[cell.name && 'min-w-125px', 'text-middle']"
                tabindex="0"
                rowspan="1"
                colspan="1"
              >
                {{ cell.name }}
              </th>
            </template>
          </tr>
          <!--end::Table row-->
        </thead>
        <!--end::Table head-->
        <!--begin::Table body-->
        <tbody class="">
          <template v-if="!isEmptyTableData">
            <template v-for="(item, i) in getItems" :key="i">
              <tr class="odd">
                <template v-for="(cell, i) in tableHeader" :key="i">
                  <td class="text-center">
                    <slot :name="`cell-${cell.key}`" :row="item">
                      {{ item[prop] }}
                    </slot>
                  </td>
                </template>
                <!--end::Item=-->
              </tr>
            </template>
          </template>
          <template v-else>
            <tr class="odd">
              <td colspan="8" class="dataTables_empty">No data found</td>
            </tr>
          </template>
        </tbody>
        <!--end::Table body-->
      </table>
    </div>

    <div class="row">
      <div
        class="
          col-sm-12 col-md-5
          d-flex
          align-items-center
          justify-content-center justify-content-md-start
        "
      >
        <!--        <div-->
        <!--          v-if="enableItemsPerPageDropdown"-->
        <!--          class="dataTables_length"-->
        <!--          id="kt_customers_table_length"-->
        <!--        >-->
        <!--          <label-->
        <!--            ><select-->
        <!--              name="kt_customers_table_length"-->
        <!--              class="form-select form-select-sm form-select-solid"-->
        <!--              v-model="paginationObj.pageSize"-->
        <!--            >-->
        <!--              <option value="10">10</option>-->
        <!--              <option value="25">25</option>-->
        <!--              <option value="50">50</option>-->
        <!--              <option value="100">100</option>-->
        <!--            </select></label-->
        <!--          >-->
        <!--        </div>-->
      </div>
      <div
        class="
          col-sm-12 col-md-7
          d-flex
          align-items-center
          justify-content-center justify-content-md-end
        "
      >
        <el-pagination
          v-if="!isEmptyTableData"
          background
          layout="prev, pager, next"
          @current-change="setCurrent"
          :current-page="paginationObj.pageNo"
          :hide-on-single-page="false"
          :page-count="pages"
          :page-size="parseInt(paginationObj.pageSize)"
          :total="paginationObj.totalPages"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  onMounted,
  watch,
  toRaw,
  onUpdated,
} from "vue";

export default defineComponent({
  name: "datatable",
  props: {
    tableHeader: { type: Array, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    enableItemsPerPageDropdown: Boolean,
    pagination: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  setup(props, ctx) {
    let data = ref(props.tableData);
    let getItems = ref(JSON.parse(JSON.stringify(data.value)));
    const paginationData = ref(props.pagination);
    let paginationObj = ref(JSON.parse(JSON.stringify(paginationData.value)));
    let isEmptyTableData = ref(getItems.value.length === 0);

    watch(
      () => props.tableData,
      (newVal, oldVal) => {
        getItems.value = newVal;
        isEmptyTableData.value = getItems.value.length === 0;
      }
    );

    watch(
      () => props.pagination,
      (newVal, oldVal) => {
        paginationObj.value = newVal;
      }
    );
    onMounted(() => {
      // paginationObj.value.rowsPerPage = props.rowsPerPage ? props.rowsPerPage : 10;
      // paginationObj.value.total = data.value['totalCount'];
    });

    const pages = computed(() => {
      // return Math.ceil(pagination.value.total / pagination.value.rowsPerPage);
      return toRaw(paginationObj.value).totalPages;
    });
    const setCurrent = (val) => {
      paginationObj.value.pageNo = val;
      ctx.emit("change-page", val);
    };

    return {
      paginationObj,
      pages,
      setCurrent,
      getItems,
      isEmptyTableData,
    };
  },
});
</script>

<style lang="scss">
table.dataTable {
  clear: both;
  margin-top: 6px !important;
  margin-bottom: 6px !important;
  max-width: none !important;
  border-collapse: separate !important;
  border-spacing: 0;
}

table.dataTable > thead {
  th.sorting {
    position: relative;
  }

  .sorting:after {
    position: absolute;
  }
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background: none;
  border-radius: 0.475rem;
  font-weight: 500;
  font-size: 1.075rem;
  font-family: Poppins, Helvetica, sans-serif;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #009ef7;
}
</style>
