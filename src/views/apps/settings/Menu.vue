<template>
  <div>
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="flex-column">
          <div
            class="col-md-8 d-flex align-items-center position-relative my-1"
          >
            <el-select
              :placeholder="translate('homeMenu')"
              size="large"
              v-model="formSearchData.publish"
              @change="submitSearch"
              clearable
            >
              <el-option
                v-for="item in selectMenu"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-primary mb-4"
            data-bs-toggle="modal"
            data-bs-target="#kt_menu_modal"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ translate("addBtn") }}
          </button>
        </div>
      </div>
    </div>
    <div class="d-flex my-8">
      <div class="card container-left">
        <div class="demo-collapse">
          <div>
            <div class="p-8">
              <h3 class="text-dark">{{ translate("customLink") }}</h3>
              <el-form ref="ruleFormRef" :model="formSearchData" class="py-4">
                <el-form-item :label="translate('url')">
                  <el-input
                    v-model="customizeLink.url"
                    :placeholder="translate('url')"
                    :disabled="!formSearchData.publish"
                    clearable
                  />
                </el-form-item>
                <el-form-item :label="translate('title')">
                  <el-input
                    v-model="customizeLink.title"
                    :disabled="!formSearchData.publish"
                    :placeholder="translate('title')"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <button
                class="btn btn-sm btn-primary"
                type="submit"
                @click="handleAddLink"
              >
                <span v-if="true" class="indicator-label">
                  {{ translate("addBtn") }}
                  <span class="svg-icon svg-icon-3 ms-2 me-0">
                    <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
                  </span>
                </span>
                <span v-if="false" class="indicator-progress">
                  Please wait...
                  <span
                    class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card mx-4 container-right">
        <div class="">
          <div class="">
            <div class="card-header align-items-center">
              <div class="d-flex align-items-center">
                <span class="name-menu">{{ translate("nameMenu") }}</span>
                <el-input
                  v-model="editMenu.menuName"
                  class="w-100 mx-3"
                  disabled="true"
                  :placeholder="translate('nameMenuValidate')"
                  size="large"
                />
              </div>
              <!-- <el-button type="primary">
                {{ translate("btnUpdateNameMenu") }}
              </el-button> -->
            </div>
            <div class="p-1 px-4 my-3 rounded">
              <div class="py-4">
                <h2>{{ translate("menuStructure") }}</h2>
                <span>{{ translate("collocation") }}</span>
              </div>
              <div>
                <div class="pt-0 container-content">
                  <NhMenu @on-item-change="onListChange" :menuArray="menuVal" />
                </div>
              </div>
              <div class="d-flex justify-content-end py-6">
                <!-- <button class="btn btn-sm btn-primary mx-4" type="submit">
                  <span class="indicator-label">
                    {{ translate("deleteBtn") }}
                  </span>
                </button> -->
                <button
                  class="btn btn-sm btn-primary"
                  type="submit"
                  @click="handleUpdateMenu"
                >
                  <span class="indicator-label">
                    {{ translate("btnUpdate") }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MenuModal
    :action="bannerAction"
    :data="bannerFormData"
    @on-close="handleCloseModal"
    @submitSearch="submitSearch"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import MenuModal from "@/components/modals/forms/MenuModal.vue";
import NhMenu from "@/components/menu/NHMenu.vue";
import { useMenu } from "@/stores/menu";
import Swal from "sweetalert2/dist/sweetalert2.js";
import qs from "qs";
import { translate } from "@/core/helpers/i18n-translate";

export default defineComponent({
  name: "menu-management",
  components: {
    MenuModal,
    NhMenu,
  },
  setup() {
    const store = useMenu();
    const nestableItems = ref([]);
    const loading = ref<boolean>(false);
    const isRearrange = ref<boolean>(false);
    const bannerAction = ref("");
    const bannerFormData = ref({});
    const menuVal = ref();
    const selectMenu = ref();
    const resChangeItemsMenu = ref();
    const arr: any = ref([]);

    let formSearchData = ref({
      publish: "",
    });

    const customizeLink = ref({
      url: "http://",
      title: "",
    });

    let editMenu = ref({
      menuName: "",
    });

    watch(formSearchData.value, (_) => {
      if (formSearchData.value.publish !== "") {
        const inputName = JSON.parse(JSON.stringify(selectMenu.value));

        editMenu.value.menuName =
          inputName[+formSearchData.value.publish - 1].label;
      } else {
        editMenu.value.menuName = "";
      }
    });

    const formatItem = (items) => {
      if (items.length > 0) {
        return items.map((item) => {
          delete item?.children;
          return {
            id: item?.id,
            label: item?.title,
            link: item?.url,
            parent: item?.parent,
            sort: item?.sort,
            menu: item?.menu,
            depth: item?.depth,
          };
        });
      }
    };

    function searchTree(element, matchingId) {
      if (element.id == matchingId) {
        return element;
      } else if (element.children != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < element.children.length; i++) {
          result = searchTree(element.children[i], matchingId);
        }
        return result;
      }
      return null;
    }

    const onListChange = (list) => {
      const initVal = JSON.parse(JSON.stringify(menuVal.value));

      let objResult: any = null;
      for (let i = 0; i < initVal.length; i++) {
        objResult = searchTree(initVal[i], list.id);
        if (objResult) {
          break;
        }
      }
      if (objResult) {
        for (let i = 0; i < Object.keys(objResult).length; i++) {
          if (
            objResult.parent !== list.parent ||
            objResult.title !== list.title ||
            objResult.url !== list.url
          ) {
            let indexTest = arr.value.findIndex((e) => e.id === list.id);
            if (indexTest !== -1) {
              arr.value.splice(indexTest, 1);
            }
            arr.value.push(list);

            break;
          } else {
            let indexTest = arr.value.findIndex((e) => e.id === list.id);
            if (indexTest !== -1) {
              arr.value.splice(indexTest, 1);
            }
            break;
          }
        }
      }

      resChangeItemsMenu.value = formatItem(arr.value);
    };

    const transformData = (data) => {
      return data.map((item) => {
        const { id, label, link, parent, depth, children, menu, sort } = item;
        const transformedItem = {
          id,
          text: label,
          title: label,
          url: link,
          parent,
          children,
          depth,
          menu,
          sort,
        };

        if (children.length > 0) {
          transformedItem.children = transformData(children);
        }
        return transformedItem;
      });
    };

    const getAllSelectMenu = async () => {
      loading.value = true;
      await store.getAllMenu();
      const requestCategoryResponse = JSON.parse(
        JSON.stringify(store.menuList)
      );
      const selectRes = requestCategoryResponse.data.map((e) => {
        return {
          id: e.id,
          label: e.name,
        };
      });
      selectMenu.value = selectRes;
      loading.value = false;
    };

    onBeforeMount(() => {
      getAllSelectMenu();
    });

    const submitSearch = async () => {
      menuVal.value = [];
      if (formSearchData.value.publish != "") {
        loading.value = true;
        await store.getDetailMenu({
          params: {
            id: formSearchData.value.publish,
          },
        });
        const detailMenuResponse = JSON.parse(
          JSON.stringify(store.menuDetailList)
        );
        menuVal.value = transformData(detailMenuResponse.data);

        loading.value = false;
      } else {
        menuVal.value = [];
      }
    };

    const handleCloseModal = () => {
      getAllSelectMenu();
    };

    const handleAddLink = async () => {
      const formData = JSON.parse(JSON.stringify(customizeLink.value));
      const result = await store.createMenuItem(
        qs.stringify({
          name: formData.title,
          link: formData.url,
          menu_id: formSearchData.value.publish,
        })
      );

      if (result.data.success === true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Successfully",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          formData.title = "";
          formData.url = "";
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: result.data.mess,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      submitSearch();
    };

    const handleUpdateMenu = async () => {
      if (resChangeItemsMenu.value) {
        const temp = JSON.parse(JSON.stringify(resChangeItemsMenu.value));
        const result = await store.updateItemMenu(
          qs.stringify({ data: JSON.stringify(temp) })
        );
        if (result.data.success === true) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Successfully",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            submitSearch();
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: result.data.mess,
            showConfirmButton: false,
            timer: 1500,
          });
        }
        // setTimeout(function () {
        //   location.reload();
        // }, 1500);
      }
    };

    return {
      selectMenu,
      loading,
      bannerAction,
      isRearrange,
      bannerFormData,
      formSearchData,
      customizeLink,
      nestableItems,
      editMenu,
      menuVal,
      Search,
      MenuModal,
      submitSearch,
      handleCloseModal,
      translate,
      onListChange,
      handleAddLink,
      handleUpdateMenu,
    };
  },
});
</script>

<style>
.del-btn {
  padding: 14px 15px;
}

.container-left {
  height: fit-content;
  flex: 1;
  width: 30%;
}

.container-right {
  width: 70%;
}

.container-content {
  overflow-x: scroll;
}

.el-collapse-item__header {
  padding-left: 12px;
  border-radius: 6px;
}

.el-collapse-item__content {
  padding: 14px;
  border-radius: 8px;
  margin-top: 8px;
}

.name-menu {
  white-space: nowrap;
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
