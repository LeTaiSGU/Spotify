import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
// import { isEmpty } from 'lodash'

// khởi tạo giá trị ban đầu cho state
const initialState = {
  currentUserLibrary: null
}

//các hành động gọi api bất đồng bộ và cập nhật dữ liệu vào redux dùng middleware createasyncthunk đi kèm với extrareducers
export const fetchLibraryDetailsAPI = createAsyncThunk(
  'userLibrary/fetchLibraryDetailsAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/libraries/`)
    return response.data
  }
)

// khởi tạo một slice trong kho lưu trữ redux
export const userLibrarySlice = createSlice({
  name: 'userLibrary',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLibraryDetailsAPI.fulfilled, (state, action) => {
      let library = action.payload
      state.currentUserLibrary = library

    })
  }
})


// selectors:
export const selectUserLibrary= (state) => {
  return state.userLibrary.currentUserLibrary
}

export const userLibraryReducer = userLibrarySlice.reducer

