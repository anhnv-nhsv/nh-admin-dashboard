<template>
  <vue-nestable
    :value="nestableItems"
    :threshold="20"
    @input="onChangeList($event)"
    @change="changeItem"
  >
    <template v-slot="slot">
      <vue-nestable-handle>
        <div
          class="custom-border bg-body align-items-center border border-solid border-gray-300 rounded w-375px min-w-200px px-7 py-3 mb-5"
        >
          <div class="d-flex justify-content-between">
            <span class="fs-5 text-dark text-hover-primary fw-bold">
              {{ slot.item.text }}
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
              <el-form-item>
                <el-input
                  :placeholder="translate('title')"
                  v-model="slot.item.title"
                />
              </el-form-item>
            </div>
            <div class="d-flex flex-column mb-7 fv-row">
              <label class="required fs-6 fw-semobold mb-2">
                {{ translate("url") }}
              </label>
              <el-form-item>
                <el-input
                  :placeholder="translate('url')"
                  v-model="slot.item.url"
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </vue-nestable-handle>
    </template>
  </vue-nestable>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { translate } from "@/core/helpers/i18n-translate";
import { VueNestable, VueNestableHandle } from "vue3-nestable";

export default defineComponent({
  name: "nh-menu",
  components: {
    VueNestable,
    VueNestableHandle,
  },
  setup(props, ctx) {
    const nestableItems = ref([
      {
        id: 0,
        text: "Andy",
        title: "Andy",
        url: "#",
      },
      {
        id: 1,
        text: "Harry",
        title: "Harry",
        url: "#",
        children: [
          {
            id: 2,
            text: "David 1",
            title: "David 1",
            url: "#",
            children: [
              {
                id: 3,
                text: "David 2",
                title: "David 2",
                url: "#",
              },
              {
                id: 4,
                text: "Lisa",
                title: "Lisa",
                url: "#",
              },
            ],
          },
          {
            id: 5,
            text: "Lisa 2",
            title: "Lisa 2",
            url: "#",
          },
          {
            id: 6,
            text: "Lisa 3",
            title: "Lisa 3",
            url: "#",
          },
        ],
      },
      {
        id: 7,
        text: "Lisa 4",
        title: "Lisa 4",
        url: "#",
      },
    ]);

    const onChangeList = (e) => {
      nestableItems.value = e;
    };

    const changeItem = (value, options) => {
      ctx.emit("on-change", JSON.parse(JSON.stringify(options.items)));
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
