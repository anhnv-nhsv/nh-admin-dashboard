<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <div class="table-responsive">
      <el-table
        class="nhTable nhTable-draggable el-table--border"
        ref="customerScoreTableRef"
        row-key="id"
        :data="getItems"
        :header-cell-style="
          themeMode === 'light'
            ? { 'background-color': '#ffc342' }
            : { 'background-color': '#1568B3' }
        "
        header-row-class-name="text-gray-800 fw-bolder fs-7 text-uppercase gs-0"
        :highlight-current-row="userRole === 'single'"
        default-expand-all
        max-height="600"
        v-on="
          userRole === 'all'
            ? { 'selection-change': handleSelectionChange }
            : { 'current-change': handleCurrentChange }
        "
        v-loading="loading"
      >
        <slot name="indexColumn"></slot>
        <template v-for="(item, i) in tableHeader" :key="i">
          <el-table-column
            :show-overflow-tooltip="showOverflowTooltip"
            header-align="center"
            class-name="text-center"
            v-if="item.visible"
            v-bind="
              item.hasOwnProperty('width')
                ? { width: item.width }
                : { 'min-width': 125 }
            "
            :label="translate(item.label)"
          >
            <template #default="scope" v-if="item.hasOwnProperty('prop')">
              <slot :name="item.prop" :row="scope.row">
                {{ scope.row[item.prop] }}
              </slot>
            </template>
            <template v-if="item.hasOwnProperty('children')">
              <el-table-column
                :show-overflow-tooltip="showOverflowTooltip"
                header-align="center"
                class-name="text-center"
                v-for="(child, j) in item.children"
                :key="`${i}${j}`"
                v-bind="
                  child.hasOwnProperty('width')
                    ? { width: child.width }
                    : { 'min-width': 125 }
                "
                :label="child.label"
                :prop="child.prop"
              />
            </template>
          </el-table-column>
        </template>
        <slot name="actionColumn"></slot>
      </el-table>
    </div>

    <div class="row">
      <div
        class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
      >
        <div
          v-if="enableItemsPerPageDropdown"
          class="dataTables_length"
          id="kt_customers_table_length"
        >
          <div class="row">
            <el-select
              style="width: 100px"
              v-model="paginationObj.pageSize"
              size="small"
              @change="setCurrentPageSize"
            >
              <el-option
                v-for="item in pageSizeList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div
        class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
      >
        <el-pagination
          v-if="!isEmptyTableData && Object.keys(paginationObj).length !== 0"
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
import { computed, defineComponent, ref, watch, toRaw, onMounted } from "vue";
import { useThemeStore } from "@/stores/theme";
import { ThemeModeComponent } from "@/assets/ts/layout";
import Sortable from "sortablejs";
import { translate } from "@/core/helpers/i18n-translate";

export default defineComponent({
  name: "nh-datatable",
  props: {
    tableHeader: { type: Array as any, required: true, default: () => [] },
    tableData: { type: Array, required: true, default: () => [] },
    pagination: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    enableItemsPerPageDropdown: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: { type: Boolean, required: false, default: false },
    showOverflowTooltip: { type: Boolean, required: false, default: false },
    draggable: { type: Boolean, required: false, default: false },
    userRole: { type: String, required: false, default: "none" },
  },
  components: {},
  setup(props, ctx) {
    let data = ref(props.tableData);
    let getItems = ref(JSON.parse(JSON.stringify(data.value)));
    const paginationData = ref(props.pagination);
    let paginationObj = ref(JSON.parse(JSON.stringify(paginationData.value)));
    let isEmptyTableData = ref(getItems.value.length === 0);
    let multipleSelection = ref<any[]>([]);
    let currentRow = ref();
    const pageSizeList = ref([10, 20, 50, 100, 200, 500, 1000]);
    const store = useThemeStore();

    watch(
      () => props.tableData,
      (newVal) => {
        getItems.value = newVal;
        isEmptyTableData.value = getItems.value.length === 0;
      }
    );

    watch(
      () => props.pagination,
      (newVal) => {
        paginationObj.value = newVal;
      }
    );

    const themeMode = computed(() => {
      if (store.mode === "system") {
        return ThemeModeComponent.getSystemMode();
      }
      return store.mode;
    });

    const pages = computed(() => {
      // return Math.ceil(pagination.value.total / pagination.value.pageSize);
      return toRaw(paginationObj.value).totalPages;
    });
    const setCurrent = (val) => {
      paginationObj.value.pageNo = val;
      ctx.emit("change-page", val);
    };

    const setCurrentPageSize = (val) => {
      paginationObj.value.pageSize = val;
      ctx.emit("change-page-size", val);
    };

    const handleSelectionChange = (val: any[]) => {
      multipleSelection.value = val;
      ctx.emit("multiple-select", val);
    };

    const handleCurrentChange = (val: any | undefined) => {
      currentRow.value = val;
      ctx.emit("single-select", val);
    };

    const initSortable = (className, draggable) => {
      const table = document.querySelector(
        "." + className + " .el-table__body-wrapper tbody"
      );
      let dragTable = Sortable.create(table, {
        animation: 250,
        disabled: !draggable,
        handle: ".draggable",
        filter: ".disabled",
        dragClass: "dragClass",
        //设置拖拽停靠样式类名
        ghostClass: "ghostClass",
        //设置选中样式类名
        chosenClass: "chosenClass",
        forceFallback: true,
        onChoose: (e) => {
          e.target.classList.add("grabbing");
        },
        onUnchoose: (e) => {
          e.target.classList.remove("grabbing");
        },
        onMove: (e) => {
          e.target.classList.add("grabbing");
        },
        // 开始拖动事件
        onStart: (e) => {
          e.target.classList.add("grabbing");
        },
        // 结束拖动事件
        onEnd: async ({ newIndex, oldIndex }) => {
          const currRow = getItems.value.splice(oldIndex, 1)[0];
          getItems.value.splice(newIndex, 0, currRow);
          ctx.emit("on-drag-end", {
            newTableData: JSON.parse(JSON.stringify(getItems.value)),
          });
        },
      });
    };

    onMounted(() => {
      initSortable("nhTable-draggable", props.draggable);
    });

    return {
      paginationObj,
      getItems,
      isEmptyTableData,
      multipleSelection,
      pageSizeList,
      pages,
      themeMode,
      handleCurrentChange,
      setCurrent,
      setCurrentPageSize,
      handleSelectionChange,
      translate,
    };
  },
});
</script>

<style scoped lang="scss">
//@import "~element-plus/theme-chalk/el-table.css";

.nhTable {
  clear: both;
  margin-top: 6px !important;
  margin-bottom: 6px !important;
  max-width: none !important;
  border-collapse: separate !important;
  border-spacing: 0;
}
:deep(.cell) {
  word-break: break-word;
}

:deep(.el-pagination.is-background .btn-next),
:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .el-pager li) {
  background: none;
  border-radius: 0.475rem;
  font-weight: 500;
  font-size: 1.075rem;
  font-family: Poppins, Helvetica, sans-serif;
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #009ef7 !important;
}

:deep(.el-scrollbar__bar.is-horizontal) {
  height: 8px;
}

:deep(.el-scrollbar__bar.is-vertical) {
  width: 8px;
}

:deep(.draggable) {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

:deep(.grabbing *) {
  cursor: grabbing !important;
}

:deep(.dragClass) {
  background-image: linear-gradient(
    rgba($color: #41c21a, $alpha: 0.5),
    rgba(255, 0, 0, 0)
  );
}

:deep(.ghostClass) {
  background-image: linear-gradient(
    rgba($color: #6cacf5, $alpha: 0.5),
    rgba(255, 0, 0, 0)
  );
}

:deep(.chosenClass:hover > td) {
  //background-image: linear-gradient(
  //  rgba($color: #f56c6c, $alpha: 0.5),
  //  rgba(255, 0, 0, 0)
  //);
  background-color: rgba($color: #f56c6c, $alpha: 0.5) !important;
}

/*Scroll bar nav*/
//:deep(::-webkit-scrollbar) {
//  height: 10px;
//  width: 10px;
//}

/* Track */
//:deep(::-webkit-scrollbar-track) {
//  background: #000 !important;
//}

/* Handle */
//:deep(::-webkit-scrollbar-thumb) {
//  background: #cccccc;
//}
//
///* Handle on hover */
//:deep(::-webkit-scrollbar-thumb:hover) {
//  background: #aaaaaa;
//}
//
///* Handle on active, holding */
//:deep(::-webkit-scrollbar-thumb:active) {
//  background: #888888;
//}
</style>
