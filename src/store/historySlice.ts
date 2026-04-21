import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { HistoryRecord } from '../types'

const STORAGE_KEY = 'shareapp_selected_record'

interface HistoryState {
  selectedRecord: HistoryRecord | null
}

function loadInitialRecord(): HistoryRecord | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as HistoryRecord
  } catch {
    return null
  }
}

const initialState: HistoryState = {
  selectedRecord: loadInitialRecord(),
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setSelectedRecord(state, action: PayloadAction<HistoryRecord>) {
      state.selectedRecord = action.payload
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))
    },
    clearSelectedRecord(state) {
      state.selectedRecord = null
      sessionStorage.removeItem(STORAGE_KEY)
    },
  },
})

export const { setSelectedRecord, clearSelectedRecord } = historySlice.actions
export const historyReducer = historySlice.reducer
