<template>
  <div class="card">
    <div class="row">
      <div class="col-12 p-12">
        <span class="block mb-8">{{ translate("numberItemPro") }}</span>
        <div
          class="text-center d-flex justify-content-center align-items-center"
        >
          <div class="d-flex justify-content-center align-items-center mx-8">
            <span
              class="d-inline-block text-nowrap mx-2 w-35 text-gray-600 inline-flex items-center"
              >{{ translate("value") }}</span
            >
            <el-input
              v-model="formSearchData.value1"
              class="w-100 m-2"
              :placeholder="translate('inputVal')"
              type="number"
            />
          </div>
          <el-button type="primary">
            {{ translate("btnUpdate") }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 p-12">
        <span class="block mb-8">{{ translate("numberItemNews") }} </span>
        <div
          class="text-center d-flex justify-content-center align-items-center"
        >
          <div class="d-flex justify-content-center align-items-center mx-8">
            <span
              class="d-inline-block text-nowrap mx-2 w-35 text-gray-600 inline-flex items-center"
              >{{ translate("value") }}</span
            >
            <el-input
              v-model="formSearchData.value2"
              class="w-100 m-2"
              :placeholder="translate('inputVal')"
              type="number"
            />
          </div>
          <el-button type="primary">
            {{ translate("btnUpdate") }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 p-12">
        <span class="block mb-8">{{ translate("colorAdmin") }} </span>
        <div
          class="text-center d-flex justify-content-center align-items-center"
        >
          <div class="d-flex justify-content-center align-items-center mx-8">
            <span
              class="d-inline-block text-nowrap mx-2 w-35 text-gray-600 inline-flex items-center"
              >{{ translate("color") }}</span
            >
            <el-select
              :placeholder="translate('inputColor')"
              size="default"
              v-model="formSearchData.color"
            >
              <el-option
                :label="translate('blue')"
                class="text-primary"
                value="1"
              />
              <el-option
                :label="translate('red')"
                class="text-danger"
                value="2"
              />
              <el-option
                :label="translate('yellow')"
                class="text-warning"
                value="3"
              />
              <el-option
                :label="translate('purple')"
                class="purple"
                value="4"
              />
              <el-option
                :label="translate('green')"
                class="text-success"
                value="5"
              />
              <el-option :label="translate('black')" class="black" value="6" />
            </el-select>
          </div>
          <el-button type="primary">
            {{ translate("btnUpdate") }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { translate } from "@/core/helpers/i18n-translate";

export default defineComponent({
  name: "display-management",
  components: {},
  setup() {
    const loading = ref<boolean>(false);
    const userList = ref([]);
    const formSearchData = ref({
      value1: "",
      value2: "",
      value3: "",
      color: "",
    });

    return {
      userList,
      formSearchData,
      loading,
      Search,
      translate,
    };
  },
});
</script>

<style scoped>
.purple {
  color: #6f42c1;
}
.black {
  color: #000;
}

.card-title {
  width: 100%;
}
</style>
