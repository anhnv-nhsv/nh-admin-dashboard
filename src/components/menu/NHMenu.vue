<template>
  <div v-if="nestableItems.length">
    <vue-nestable
      :value="nestableItems"
      :threshold="20"
      @input="onChangeList"
      @change="changeItem"
      :maxDepth="20"
    >
      <template v-slot="slot">
        <vue-nestable-handle>
          <div
            class="custom-border bg-body align-items-center border border-solid border-gray-300 rounded w-375px min-w-200px px-7 py-3 mb-5"
          >
            <div class="d-flex justify-content-between">
              <span class="fs-5 text-dark text-hover-primary fw-bold">
                {{ slot.item.title }}
              </span>
              <div
                class="fw-bold fs-3 rotate collapsible"
                data-bs-toggle="collapse"
                :href="`#kt_edit_menu_collapse_${slot.item.id}`"
                role="button"
                aria-expanded="false"
                aria-controls="kt_edit_menu_collapse"
              >
                <span class="ms-2 rotate-180">
                  <KTIcon icon-name="down" icon-class="fs-3" />
                </span>
              </div>
            </div>
            <div
              :id="`kt_edit_menu_collapse_${slot.item.id}`"
              class="mt-5 px-5 collapse"
            >
              <div class="d-flex flex-column mb-7 fv-row">
                <label class="required fs-6 fw-semobold mb-2">
                  {{ translate("title") }}
                </label>
                <input
                  v-model="slot.item.title"
                  type="text"
                  class="form-control form-control-solid"
                  :placeholder="translate('title')"
                  @change.stop="onChangeList(slot.item)"
                  @input.stop
                />
              </div>
              <div class="d-flex flex-column mb-7 fv-row">
                <label class="required fs-6 fw-semobold mb-2">
                  {{ translate("url") }}
                </label>
                <input
                  v-model="slot.item.url"
                  type="text"
                  class="form-control form-control-solid"
                  :placeholder="translate('url')"
                  @change.stop="onChangeList(slot.item)"
                  @input.stop
                />
              </div>
            </div>
          </div>
        </vue-nestable-handle>
      </template>
    </vue-nestable>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { translate } from "@/core/helpers/i18n-translate";
import { VueNestable, VueNestableHandle } from "vue3-nestable";

export default defineComponent({
  name: "nh-menu",
  props: {
    menuArray: { type: Array, required: true, default: () => [] },
  },
  components: {
    VueNestable,
    VueNestableHandle,
  },
  setup(props, ctx) {
    const nestableItems = ref(props?.menuArray);

    watch(
      () => props.menuArray,
      (newVal) => {
        nestableItems.value = newVal;
      }
    );

    const onChangeList = (e) => {
      if (e.length) {
        nestableItems.value = e;
      } else {
        ctx.emit("on-item-change", JSON.parse(JSON.stringify(e)));
      }
    };

    const changeItem = (value, options) => {
      if (options?.items) {
        if (options.pathTo?.length > 0) {
          const objTest = findCurrParent(options.pathTo);
          value.parent = value.id === objTest.id ? 0 : objTest.id;
          value.depth = options.pathTo.length - 1;
          // changeParentId(
          //   nestableItems.value[options.pathTo[0]],
          //   value,
          //   objTest
          // );
        }
      }
      ctx.emit("on-item-change", JSON.parse(JSON.stringify(value)));
    };

    const findCurrParent = (path) => {
      let obj: any = nestableItems.value[path[0]];
      let end = path.length - 2,
        i = 1;
      while (end >= 0 && i <= end) {
        obj = obj.children[path[i]];
        i++;
      }
      return obj;
    };

    const changeParentId = (root, item, newParent) => {
      if (root.id === item.id) {
        root.parent = 0;
        return root;
      } else if (root.children && root.children.length > 0) {
        for (let child of root.children) {
          root = changeParentId(child, item, newParent);
          if (root) {
            root.parent = newParent.id;
            return root;
          }
        }
      } else {
        return null;
      }
    };

    return {
      nestableItems,
      changeItem,
      onChangeList,
      translate,
    };
  },
});
</script>

<style scoped lang="scss">
$background-color_1: rgba(106, 127, 233, 0.274);

/*
* Style for nestable
*/
.nestable {
  position: relative;
  :deep(.nestable-list) {
    margin: 0;
    padding: 0 0 0 40px;
    list-style-type: none;
    width: fit-content;
  }
  > .nestable-list {
    padding: 0;
  }
  [draggable="true"] {
    cursor: move;
  }
}
.nestable-rtl {
  direction: rtl;
  .nestable-list {
    padding: 0 40px 0 0;
  }
  .nestable-drag-layer {
    left: auto;
    right: 0;
    > .nestable-list {
      padding: 0;
    }
  }
}
:deep(.nestable-item) {
  margin: 10px 0 0;
  position: relative;
  &:first-child {
    margin-top: 0;
  }
  .nestable-list {
    margin-top: 10px;
  }
}
:deep(.nestable-item-copy) {
  margin: 10px 0 0;
  &:first-child {
    margin-top: 0;
  }
  .nestable-list {
    margin-top: 10px;
  }
}
:deep(.nestable-item.is-dragging) {
  .nestable-list {
    pointer-events: none;
  }
  * {
    opacity: 0;
    filter: alpha(opacity=0);
  }
  &:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    //background-color: $background-color_1;
    border: 1px dashed rgb(73, 100, 241);
    -webkit-border-radius: 5px;
    border-radius: 5px;
    display: inline-block;
  }
}
:deep(.nestable-drag-layer) {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
  div.custom-border {
    border: 1px solid var(--bs-gray-600) !important;
    //background-color: var(--bs-white);
  }
  > .nestable-list {
    position: relative;
    top: 0;
    left: 0;
    padding: 0;
    //background-color: $background-color_1;
  }
}
:deep(.nestable-handle) {
  display: inline;
  > div:hover {
    border: 1px solid var(--bs-gray-600) !important;
  }
}
</style>
