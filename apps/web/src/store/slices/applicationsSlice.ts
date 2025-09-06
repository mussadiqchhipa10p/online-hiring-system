import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Application, CreateApplicationRequest, ApplicationFilterParams } from '@online-hiring-system/types';
import { applicationsService } from '../../services/applicationsService';

interface ApplicationsState {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  filterParams: ApplicationFilterParams;
}

const initialState: ApplicationsState = {
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  filterParams: {
    page: 1,
    limit: 10,
  },
};

// Async thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (params: ApplicationFilterParams, { rejectWithValue }) => {
    try {
      const response = await applicationsService.getApplications(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch applications');
    }
  }
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (data: CreateApplicationRequest, { rejectWithValue }) => {
    try {
      const application = await applicationsService.createApplication(data);
      return application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create application');
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchApplicationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const application = await applicationsService.getApplicationById(id);
      return application;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch application');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilterParams: (state, action: PayloadAction<ApplicationFilterParams>) => {
      state.filterParams = { ...state.filterParams, ...action.payload };
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.data || [];
        state.totalCount = action.payload.pagination?.total || 0;
        state.currentPage = action.payload.pagination?.page || 1;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create application
      .addCase(createApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch application by ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilterParams, clearCurrentApplication } = applicationsSlice.actions;
export default applicationsSlice.reducer;
