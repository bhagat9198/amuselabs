
import { BASE_URL } from "@/utils/constants";

export namespace HomeApiType {
  export type GetAnalyticsApiArgsType = {
    startAt?: number;
    endAt?: number;
  }
}

export const getAanalyticsApi = async (args: HomeApiType.GetAnalyticsApiArgsType) => {
  try {
    const _res = await fetch(`${BASE_URL}/logs/analyse`, {
      method: 'GET'
    });
    const _resJson = await _res.json();
    console.log('HomeApi :: getAanalyticsApi :: _resJson :: ', _resJson);
    return _resJson;
  } catch (error) {
    console.log('HomeApi :: getAanalyticsApi :: error :: ', error);
    return error?.message || 'Something went wrong';
  }
}


export const HomeApi = {
  getAanalytics: getAanalyticsApi
}