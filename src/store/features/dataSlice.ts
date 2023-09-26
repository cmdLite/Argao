import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const apiUrl = "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=100";

interface RaceSummary {
  advertised_start: {
    seconds: number;
  };
  category_id: string;
  meeting_id: string;
  meeting_name: string;
  race_id: string;
  race_name: string;
  race_number: number;
}

interface NextToGo {
  next_to_go_ids: Array<string>;
  race_summaries: {
    [race_id: string]: RaceSummary;
  };
  length: number;
}

export interface DataState {
  nextToGo: NextToGo | null;
  raceSummaries: RaceSummary | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: DataState = {
  nextToGo: null,
  raceSummaries: null,
  status: "idle",
  error: null,
};


export const fetchData = createAsyncThunk("data/fetchData", async () => {
  const response = await fetch(apiUrl,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  const responseData = data.data;
  if (Array.isArray(responseData.race_summaries)) {
    const filteredRaceSummaries = responseData.race_summaries.filter(
      (raceSummary: RaceSummary) =>
        raceSummary.category_id === "9daef0d7-bf3c-4f50-921d-8e818c60fe61" ||
        raceSummary.category_id === "161d9be2-e909-4326-8c2c-35ed71fb460b" ||
        raceSummary.category_id === "4a2788f8-e825-4d36-9894-efd4baf1cfae"
    );
    console.log(filteredRaceSummaries);
    responseData.race_summaries = filteredRaceSummaries;
  }
  return responseData;
});

export const DataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "idle";
        state.nextToGo = action.payload.next_to_go_ids;
        state.raceSummaries = action.payload.race_summaries;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export const selectNextToGo = (state: RootState) => state.data.nextToGo;
export const selectRaceSummaries = (state: RootState) => state.data.raceSummaries;
export const selectDataStatus = (state: RootState) => state.data.status;
export const selectDataError = (state: RootState) => state.data.error;

export default DataSlice.reducer;