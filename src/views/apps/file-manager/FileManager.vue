<template>
  <div class="card">
    <iframe
      class="rounded w-100 custom-height-100vh"
      src="http://172.33.30.19:8010/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1&lang=en_EN&akey=YQv5t_7gG2.gu7b7\-xcoW"
      :allowfullscreen="true"
    ></iframe>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "file-manager",
});
</script>

<style scoped lang="scss">
.custom-height-100vh {
  height: 100vh;
}
</style>
