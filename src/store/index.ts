import { createStore } from "vuex";
import { config } from "vuex-module-decorators";

import AuthModule from "@/store/modules/AuthModule";
import BodyModule from "@/store/modules/BodyModule";
import BreadcrumbsModule from "@/store/modules/BreadcrumbsModule";
import ConfigModule from "@/store/modules/ConfigModule";
import RequestStatisticModule from "@/store/modules/RequestStatisticModule";
import CustomerScoreModule from "@/store/modules/CustomerScoreModule";

config.rawError = true;

const store = createStore({
  modules: {
    AuthModule,
    BodyModule,
    BreadcrumbsModule,
    ConfigModule,
    RequestStatisticModule,
    CustomerScoreModule,
  },
});

export default store;
