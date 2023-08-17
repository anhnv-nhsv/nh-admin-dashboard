import ApiService from "@/core/services/ApiService";
// import JwtService from "@/core/services/JwtService";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";

export interface RequestStatisticsInfo {
  seq?: string;
  clientUserName?: string;
  fromIP?: string;
  apiUri?: string;
  statusCode?: string;
  message?: string;
  thirtyServiceAPIURI?: string;
  thirtyResponseTime?: string;
}

@Module
export default class RequestStatisticModule extends VuexModule {
  reqs = [] as RequestStatisticsInfo;

  get requestStatisticsResponse(): RequestStatisticsInfo {
    return JSON.parse(JSON.stringify(this.reqs));
  }

  @Mutation
  [Mutations.GET_REQUEST_STATISTICS_MUTATION](response) {
    this.reqs = response;
  }

  @Action
  [Actions.GET_REQUEST_STATISTICS_ACTION](params) {
    return new Promise<void>((resolve, reject) => {
      ApiService.query("/api/search-history", params)
        .then((res) => {
          this.context.commit(
            Mutations.GET_REQUEST_STATISTICS_MUTATION,
            res.data
          );
          resolve();
        })
        .catch((err) => {
          this.context.commit(Mutations.SET_ERROR, err);
          reject();
        });
    });
  }
}
