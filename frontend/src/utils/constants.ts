export const BASE_URL = `http://localhost:5300`;

const defaultNowDate = new Date();
export const defaultCurrentTime = defaultNowDate.getTime();

// export const defaultStartOfTodayTime = new Date(defaultNowDate.getFullYear(), defaultNowDate.getMonth(), defaultNowDate.getDate()).getTime();
// export const defaultStartOfTodayTime = new Date(defaultNowDate.getFullYear(), defaultNowDate.getMonth(), defaultNowDate.getDate()).getTime();
export const defaultStartOfTodayTime = new Date(
  defaultNowDate.getFullYear(),
  defaultNowDate.getMonth(),
  defaultNowDate.getDate() - 5
).getTime();

