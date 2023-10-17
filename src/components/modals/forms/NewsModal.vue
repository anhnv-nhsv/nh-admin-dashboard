<template>
  <div
    class="modal fade"
    id="kt_news_modal"
    ref="pageModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered mw-75"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">
            {{ translate("addNewsList") }}
          </h2>
          <h2 class="fw-bolder" v-else>{{ translate("editNewsList") }}</h2>
          <div
            id="kt_customer_export_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body mx-5 mx-xl-5 my-7">
          <NhForm seoable>
            <template v-slot:customForm>
              <el-form
                ref="ruleFormRef"
                :model="pageForm"
                label-width="160px"
                class="demo-ruleForm"
                status-icon
                :size="formSize"
                :rules="rules"
              >
                <el-form-item>
                  <ul
                    class="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6"
                  >
                    <li class="nav-item">
                      <a
                        class="nav-link active"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_1"
                        >{{ translate("vietnamese") }}</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_2"
                        >{{ translate("english") }}</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_3"
                        >{{ translate("korea") }}</a
                      >
                    </li>
                  </ul>
                </el-form-item>
                <div class="tab-content" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="nh_tab_pane_1"
                    role="tabpanel"
                  >
                    <el-form-item :label="translate('title')" prop="name">
                      <el-input
                        v-model="pageForm.name"
                        :placeholder="translate('vietnamese')"
                        clearable
                        @input="generateSlug(pageForm.name)"
                      />
                    </el-form-item>
                    <el-form-item :label="translate('content')" prop="content">
                      <NhEditor
                        v-model="pageForm.content"
                        :placeholder="translate('vietnamese')"
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_2" role="tabpanel">
                    <el-form-item :label="translate('title')">
                      <el-input
                        v-model="pageForm.name_english"
                        :placeholder="translate('english')"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item :label="translate('content')">
                      <NhEditor
                        v-model="pageForm.content_english"
                        :placeholder="translate('english')"
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_3" role="tabpanel">
                    <el-form-item :label="translate('title')">
                      <el-input
                        v-model="pageForm.name_korea"
                        :placeholder="translate('korea')"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item :label="translate('content')">
                      <NhEditor
                        v-model="pageForm.content_korea"
                        :placeholder="translate('korea')"
                      />
                    </el-form-item>
                  </div>
                </div>
                <el-form-item :label="translate('hotNews')">
                  <el-radio-group v-model="pageForm.status">
                    <el-radio :label="1">{{ translate("no") }}</el-radio>
                    <el-radio :label="2">{{ translate("yes") }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  :label="translate('newsSection')"
                  prop="parentCategory"
                >
                  <el-cascader
                    v-model="pageForm.parentCategory"
                    :options="parents"
                    :teleported="false"
                    :props="cascaderConfig"
                    clearable
                    filterable
                    style="width: 100%"
                    @change="handleChangeCategory"
                  />
                </el-form-item>
                <el-form-item :label="translate('image')" prop="imageUrl">
                  <el-input
                    v-model="pageForm.image"
                    :placeholder="translate('image')"
                    clearable
                    disabled
                  >
                    <template #prepend>
                      <el-button type="primary" @click.prevent="chooseImage"
                        >{{ translate("chooseFile") }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item
                  :label="translate('postingTime')"
                  prop="time_post"
                >
                  <div class="demo-datetime-picker" style="width: 100%">
                    <div class="block">
                      <el-date-picker
                        v-model="pageForm.time_post"
                        type="datetime"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :teleported="false"
                        :editable="false"
                        :placeholder="translate('newsDateTime')"
                      />
                    </div>
                  </div>
                </el-form-item>
                <el-form-item :label="translate('url')">
                  <el-input
                    v-model="pageForm.url"
                    :placeholder="translate('url')"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item :label="translate('publish')">
                  <el-switch v-model="pageForm.publish" />
                </el-form-item>
              </el-form>
            </template>
          </NhForm>
        </div>
        <div class="modal-footer">
          <button
            type="reset"
            id="kt_modal_test_editor_cancel"
            class="btn btn-light me-3"
            data-bs-dismiss="modal"
          >
            {{ translate("discard") }}
          </button>
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            v-if="action === 'add'"
            @click="handleAdd(ruleFormRef)"
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
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            v-if="action === 'edit'"
            @click="handleEdit(ruleFormRef)"
          >
            <span v-if="true" class="indicator-label">
              {{ translate("editBtn") }}
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
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { translate } from "@/core/helpers/i18n-translate";
import NhForm from "@/components/nh-forms/NHForm.vue";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { FormInstance, UploadInstance } from "element-plus";
import NhEditor from "@/components/editor/NHEditor.vue";
import { useNewsListStore } from "@/stores/news-list";
import Swal from "sweetalert2/dist/sweetalert2.js";
import qs from "qs";
import { hideModal } from "@/core/helpers/dom";

export default defineComponent({
  name: "page-category-modal",
  props: {
    action: { type: String, default: () => "add", required: false },
    rowDetail: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    abc: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    nameCate: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    submitSearch: {
      type: Function,
    },
  },
  components: { NhEditor, NhForm },
  setup: function (props, ctx) {
    const store = useNewsListStore();
    const detailData = ref(props.rowDetail);
    const getAllRes = ref(props.abc);
    const publish = ref();
    const status = ref();
    const typePost = ref();
    const categoryId = ref();
    const parentId = ref();
    const idRow = ref();
    const rowValue = ref(JSON.parse(JSON.stringify(detailData.value)));
    const qwe = ref(JSON.parse(JSON.stringify(getAllRes.value)));
    const parents = ref();
    const idSelect = ref();
    const formSize = ref("default");
    const ruleFormRef = ref<FormInstance>();
    const pageModalRef = ref<null | HTMLElement>(null);
    const rules = reactive({
      name: [
        {
          required: true,
          message: translate("titleValidate"),
          trigger: "blur",
        },
      ],
      name_korea: [
        {
          required: true,
          message: translate("titleValidate"),
          trigger: "blur",
        },
      ],
      name_english: [
        {
          required: true,
          message: translate("titleValidate"),
          trigger: "blur",
        },
      ],
      parentCategory: [
        {
          required: true,
          message: translate("parentCategoryValidate"),
          trigger: "change",
        },
      ],
      content: [
        {
          required: true,
          message: translate("contentValidate"),
          trigger: "change",
        },
      ],
      time_post: [
        {
          required: true,
          message: translate("timePost"),
          trigger: "change",
        },
      ],
      content_english: [
        {
          required: true,
          message: translate("contentValidate"),
          trigger: "change",
        },
      ],
      content_korea: [
        {
          required: true,
          message: translate("contentValidate"),
          trigger: "change",
        },
      ],
    });

    let pageForm = ref({
      name: "",
      name_english: "",
      name_korea: "",
      slug: "",
      content: "",
      content_english: "",
      content_korea: "",
      image: "",
      image_english: "",
      image_korea: "",
      featuredImgUrl: "",
      url: "/tin-tuc/.html",
      parentCategory: [] as any,
      time_post: "",
      status: 2,
      publish: true,
    });

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

    watch(
      () => props.rowDetail,
      (newVal) => {
        if (Object.keys(newVal).length !== 0 && newVal.constructor === Object) {
          rowValue.value = newVal;
          pageForm.value.name = rowValue.value.name;
          pageForm.value.name_english = rowValue.value.name_english;
          pageForm.value.name_korea = rowValue.value.name_korea;
          pageForm.value.slug = rowValue.value.slug;
          pageForm.value.content = rowValue.value.content;
          pageForm.value.content_english = rowValue.value.content_english;
          pageForm.value.content_korea = rowValue.value.content_korea;
          pageForm.value.image = rowValue.value.image;
          pageForm.value.image_english = rowValue.value.image_english;
          pageForm.value.image_korea = rowValue.value.image_korea;
          pageForm.value.featuredImgUrl = rowValue.value.featuredImgUrl;
          pageForm.value.url =
            "/tin-tuc/" + toSlug(rowValue.value.name) + ".html";
          idRow.value = rowValue.value.id;
          pageForm.value.parentCategory = [rowValue.value.category_id];
          pageForm.value.time_post = formatDate(rowValue.value.time_post);
          pageForm.value.publish = rowValue.value.publish === 0 ? false : true;
          pageForm.value.status = rowValue.value.status === "Noi_bat" ? 2 : 1;
          status.value = rowValue.value.status;
          publish.value = rowValue.value.publish;
          typePost.value = rowValue.value.type_post;
          categoryId.value = rowValue.value.category_id;
          parentId.value = rowValue.value.parent_id;
        } else {
          pageForm.value = {
            name: "",
            name_english: "",
            name_korea: "",
            slug: "",
            content: "",
            content_english: "",
            content_korea: "",
            image: "",
            image_english: "",
            image_korea: "",
            featuredImgUrl: "",
            url: "/tin-tuc/.html",
            parentCategory: [],
            time_post: "",
            status: 2,
            publish: true,
          };
        }
      }
    );

    watch(
      () => props.nameCate,
      (newVal) => {
        parents.value = buildHierarchy(newVal);
      }
    );

    const cascaderConfig = {
      expandTrigger: "hover" as const,
      value: "id",
    };

    const handleAdd = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const formData = JSON.parse(JSON.stringify(pageForm.value));
          const result = await store.createNewsList(
            qs.stringify({
              ...formData,
              status: formData.status === 2 ? "Noi_bat" : "",
              type_post: "page",
              category_id: idSelect.value,
              parent_id: idSelect.value,
              slug: resSlug(formData.url),
              publish: formData.publish === false ? 0 : 1,
              time_post: formData.time_post,
              image: formData.image || "",
            })
          );
          if (result.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("addNewsSuccessfully"),
              showConfirmButton: false,
              timer: 1500,
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
          ctx.emit("submitSearch");
          hideModal(pageModalRef.value);
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const handleEdit = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const formData = JSON.parse(JSON.stringify(pageForm.value));
          const result = await store.editNewsList(
            qs.stringify({
              ...formData,
              status: formData.status === 2 ? "Noi_bat" : "",
              type_post: typePost.value,
              category_id: idSelect.value || categoryId.value,
              parent_id: idSelect.value || categoryId.value,
              publish: formData.publish === false ? 0 : 1,
              id: idRow.value,
              slug: resSlug(formData.url),
              time_post: formData.time_post,
              image: formData.image || "",
            })
          );
          if (result.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("editNewsSuccessfully"),
              showConfirmButton: false,
              timer: 1500,
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
          ctx.emit("submitSearch");
          hideModal(pageModalRef.value);
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);
    const uploadRef = ref<UploadInstance>();
    const fileList = ref<any>([]);

    const handleChangeCategory = (value) => {
      const temp = JSON.parse(JSON.stringify(value));
      const a = temp[temp.length - 1];

      idSelect.value = a.toString();
    };

    const generateSlug = (title) => {
      pageForm.value.url = "/tin-tuc/" + toSlug(title) + ".html";
    };

    const toSlug = (str) => {
      /* eslint-disable no-useless-escape */
      const a =
        "àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;";
      const b =
        "aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------";
      const p = new RegExp(a.split("").join("|"), "g");
      return str
        .toString()
        .toLowerCase()
        .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a")
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e")
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, "i")
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o")
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u")
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y")
        .replace(/đ/gi, "d")
        .replace(/\s+/g, "-")
        .replace(p, (c) => b.charAt(a.indexOf(c)))
        .replace(/&/g, "-and-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    };

    const resSlug = (val) => {
      const newsMatch = val.match(/\/tin-tuc\/([^/]+)\.html/);

      if (newsMatch) {
        return newsMatch[1];
      } else {
        const htmlMatch = val.match(/([^/]+)\.html$/);
        if (htmlMatch) {
          return htmlMatch[1];
        } else {
          return val;
        }
      }
    };

    const chooseImage = () => {
      window.addEventListener("message", handleMessage);
      Swal.fire({
        width: "80%",
        heightAuto: false,
        /* eslint-disable no-useless-escape */
        html: `<iframe
                    ref="fileManagerIframe"
                    class="rounded h-600px w-100"
                    src="http://172.33.30.19:8010/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1&lang=en_EN&akey=YQv5t_7gG2.gu7b7\-xcoW"
                    :allowfullscreen="true"
               ></iframe>`,
        closeButtonAriaLabel: "Close file manager",
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
          htmlContainer: "rfm-height-100",
        },
      });
    };

    const handleMessage = (event) => {
      if (event.data.sender === "responsivefilemanager") {
        if (event.data.field_id) {
          pageForm.value.image = event.data.url;
          Swal.close();
          // Delete handler of the message from ResponsiveFilemanager
          window.removeEventListener("message", handleMessage);
        }
      }
    };

    const formatDate = (val) => {
      // Create a Date object from the original string
      const date = new Date(val);

      // Extract the date and time components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = "00";

      // Create the formatted string
      const formattedDateTime =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;

      return formattedDateTime;
    };

    return {
      cascaderConfig,
      chooseImage,
      pageForm,
      Delete,
      Plus,
      ZoomIn,
      dialogImageUrl,
      parents,
      dialogVisible,
      uploadRef,
      fileList,
      rowValue,
      qwe,
      rules,
      formSize,
      ruleFormRef,
      pageModalRef,
      handleChangeCategory,
      handleAdd,
      generateSlug,
      handleEdit,
      translate,
    };
  },
});
</script>

<style scoped lang="scss">
.tab-content {
  width: 100%;
}
.avatar-uploader .avatar {
  width: 100%;
  //height: 178px;
  display: block;
}
.hide-upload {
  :deep(div.el-upload.el-upload--picture-card) {
    display: none !important;
  }
}
</style>
