import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Actions, Mutations } from "@/store/enums/StoreEnums";
import ApiService from "@/core/services/ApiService";

@Module
export default class CustomerScoreModule extends VuexModule {
  customersScoreResp = [];
  syncKalapaStatusCode = -1;
  exportCustomerResp = -1;

  get getCustomersScore() {
    return JSON.parse(JSON.stringify(this.customersScoreResp));
  }

  get getSyncKalapaStatusCode() {
    return this.syncKalapaStatusCode;
  }

  get getExportCustomerResp() {
    return this.exportCustomerResp;
  }

  @Mutation
  [Mutations.GET_CUSTOMERS_SCORE_MUTATION](response) {
    this.customersScoreResp = response;
  }

  @Mutation
  [Mutations.SYNC_KALAPA_SCORE_MUTATION](response) {
    this.syncKalapaStatusCode = response;
  }

  @Mutation
  [Mutations.EXPORT_CUSTOMERS_SCORE_MUTATION](response) {
    this.exportCustomerResp = response;
  }

  @Action
  [Actions.GET_CUSTOMERS_SCORE_ACTION](params) {
    return new Promise<void>((resolve, reject) => {
      ApiService.query("/api/account-info", params)
        .then((res) => {
          this.context.commit(Mutations.GET_CUSTOMERS_SCORE_MUTATION, res.data);
          resolve();
        })
        .catch((err) => {
          this.context.commit(Mutations.SET_ERROR, err);
          reject();
        });
    });
  }

  @Action
  [Actions.SYNC_KALAPA_SCORE_ACTION](params) {
    return new Promise<void>((resolve, reject) => {
      ApiService.post("/api/account-info/sync-kalapa", params)
        .then((res) => {
          console.log(res);
          this.context.commit(Mutations.SYNC_KALAPA_SCORE_MUTATION, res.status);
          resolve();
        })
        .catch((err) => {
          this.context.commit(Mutations.SET_ERROR, err);
          reject();
        });
    });
  }

  @Action
  [Actions.EXPORT_CUSTOMERS_SCORE_ACTION](params) {
    return new Promise<void>((resolve, reject) => {
      ApiService.query("/api/account-info/export/excel", params)
        .then((res) => {
          console.log(res);
          this.context.commit(Mutations.EXPORT_CUSTOMERS_SCORE_MUTATION, res);
          resolve();
        })
        .catch((err) => {
          this.context.commit(Mutations.SET_ERROR, err);
          reject();
        });
    });
  }
}
