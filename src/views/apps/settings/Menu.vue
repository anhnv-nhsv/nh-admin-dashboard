<template>
  <div>
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="flex-column">
          <div
            class="col-md-8 d-flex align-items-center position-relative my-1"
          >
            <el-select
              placeholder="Status"
              size="large"
              v-model="formSearchData.publish"
              @change="submitSearch"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
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
                    v-model="formSearchData.url"
                    :placeholder="translate('url')"
                    clearable
                  />
                </el-form-item>
                <el-form-item :label="translate('title')">
                  <el-input
                    v-model="formSearchData.title"
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
                  :placeholder="translate('nameMenuValidate')"
                  size="large"
                />
              </div>
              <el-button type="primary">
                {{ translate("btnUpdate") }}
              </el-button>
            </div>
            <div class="p-1 px-4 my-3 rounded">
              <div class="py-4">
                <h2>{{ translate("menuStructure") }}</h2>
                <span>{{ translate("collocation") }}</span>
              </div>
              <div>
                <div class="pt-0 container-content">
                  <NhMenu @on-change="onListChange" :menuArray="menuVal" />
                </div>
              </div>
              <div class="d-flex justify-content-end py-6">
                <button class="btn btn-sm btn-primary mx-4" type="submit">
                  <span class="indicator-label">
                    {{ translate("deleteBtn") }}
                  </span>
                </button>
                <button class="btn btn-sm btn-primary" type="submit">
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
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import MenuModal from "@/components/modals/forms/MenuModal.vue";
import NhMenu from "@/components/menu/NHMenu.vue";
import { useBanner } from "@/stores/banner";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { translate } from "@/core/helpers/i18n-translate";

export default defineComponent({
  name: "menu-management",
  components: {
    MenuModal,
    NhMenu,
  },
  setup() {
    const store = useBanner();
    const nestableItems = ref([]);
    const loading = ref<boolean>(false);
    const isRearrange = ref<boolean>(false);
    const bannerAction = ref("");
    const bannerFormData = ref({});
    const bannerList = ref([]);
    const menuVal = ref();

    // const options = [
    //   {
    //     value: "",
    //     label: translate("select"),
    //   },
    //   {
    //     value: "1",
    //     label: translate("menuTopVi"),
    //   },
    //   {
    //     value: "2",
    //     label: translate("menuTopEn"),
    //   },
    //   {
    //     value: "3",
    //     label: translate("menuTopKr"),
    //   },
    //   {
    //     value: "4",
    //     label: translate("menuBannerVi"),
    //   },
    //   {
    //     value: "5",
    //     label: translate("menuBannerEn"),
    //   },
    //   {
    //     value: "6",
    //     label: translate("menuBannerKr"),
    //   },
    //   {
    //     value: "7",
    //     label: translate("openAcc"),
    //   },
    //   {
    //     value: "8",
    //     label: translate("menuVertical"),
    //   },
    // ];
    const options = [
      {
        label: translate("select"),
        value: "",
        data: [],
      },
      {
        label: translate("menuTopVi"),
        value: "1",
        data: [
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
          {
            id: 8,
            text: "Lisa 8",
            title: "Lisa 8",
            url: "#",
          },
          {
            id: 9,
            text: "Lisa 9",
            title: "Lisa 9",
            url: "#",
          },
          {
            id: 10,
            text: "Lisa 10",
            title: "Lisa 10",
            url: "#",
          },
        ],
      },
      {
        label: translate("menuTopEn"),
        value: "2",
        data: [
          {
            id: 0,
            text: "Harry",
            title: "Harry",
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
        ],
      },
    ];
    let formSearchData = ref({
      publish: "",
      activeNames: "1",
      url: "http://",
      title: "",
    });

    let editMenu = ref({
      menuName: "",
    });

    const onListChange = (list) => {
      // nestableItems.value = list;
      console.log(list);
    };

    watch(formSearchData.value, (_) => {
      if (formSearchData.value.publish !== "") {
        editMenu.value.menuName = options[formSearchData.value.publish].label;
      } else {
        editMenu.value.menuName = "";
      }
    });

    watch(formSearchData.value, (_) => {
      if (formSearchData.value.publish !== "") {
        const result = options.find(
          (item) => item.value === formSearchData.value.publish
        );
        menuVal.value = JSON.parse(JSON.stringify(result?.data));
      } else {
        menuVal.value = [];
      }
    });

    const handleApplyStatus = () => {};
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

    const getAllBanner = async (
      pageNo?: number,
      publish?: string,
      pageSize = 1000
    ) => {
      loading.value = true;
      // await store.getBannerList({
      //   params: {
      //     pageNo: pageNo,
      //     pageSize: pageSize,
      //     menu: publish,
      //   },
      // });
      // const response = JSON.parse(JSON.stringify(store.bannerList));
      // bannerList.value = response.data;
      loading.value = false;
    };

    onBeforeMount(() => {
      getAllBanner(1);
    });

    const submitSearch = () => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllBanner(1, formData.publish ? formData.publish : "");
    };

    const addBanner = () => {
      bannerAction.value = "add";
      bannerFormData.value = {
        name: "",
        attachUrl: "",
        imageUrl: "",
        content: "",
        isPublish: false,
      };
    };

    const editBanner = (val?: object | undefined) => {
      bannerAction.value = "edit";
      const row = JSON.parse(JSON.stringify(val));
      bannerFormData.value = {
        id: row.id,
        name: row.name,
        attachUrl: row.link,
        imageUrl: row.image,
        content: row.content,
        isPublish: row.publish,
      };
    };

    const deleteBanner = (val) => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
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
          const response = await store.deleteBanner({ id: val.id });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("successfully"),
              showConfirmButton: false,
              timer: 1000,
            });
            await getAllBanner(1, formData.publish ? formData.publish : "");
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

    const handleCloseModal = () => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getAllBanner(1, formData.publish ? formData.publish : "");
    };

    const handleAddLink = () => {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      console.log("--->: ", {
        title: formData.title,
        url: formData.url,
      });
    };

    return {
      bannerList,
      loading,
      bannerAction,
      isRearrange,
      bannerFormData,
      formSearchData,
      options,
      nestableItems,
      editMenu,
      menuVal,
      Search,
      MenuModal,
      addBanner,
      submitSearch,
      handleChangeStatus,
      deleteBanner,
      editBanner,
      handleApplyStatus,
      handleCloseModal,
      translate,
      onListChange,
      handleAddLink,
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
