import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginationSortableDto } from "../_common";

// Create Type of State and Intitial State
export type DocumentState = {
    documentSubTypeId?: number;
    documentTypeId?: number;
    searchText?: string;
    documentSearchPagination: PaginationSortableDto;
    url?: string;
    isImage?: boolean;
};

export type DocumentIndexInputState = {
    indexId?: string[];
    indexValue?: string[];
};

export type DocumentPayloadForUploadState = {
    documentId?: string;
    documentCode?: string;
    mainIndex?: string;
    searchIndex?: string;
};

export type DocumentFileIdState = {
    documentFileId: string;
};

export type DocumentStates = DocumentState &
    DocumentIndexInputState &
    DocumentPayloadForUploadState &
    DocumentFileIdState;

const initialState: DocumentStates = {
    documentSubTypeId: 0,
    documentTypeId: 0,
    searchText: "",
    documentSearchPagination: {
        page: 1,
        recordsPerPage: 5,
    },
    url: "",
    isImage: false,
    indexId: [],
    indexValue: [],
    documentId: "",
    documentCode: "",
    mainIndex: "",
    searchIndex: "",
    documentFileId: "",
};

//Create Payload
export type DocumentSearchValue = {
    documentSubTypeId?: number | undefined;
    documentTypeId?: number | undefined;
    searchText?: string;
};

export type SetURLPreviewPayload = {
    url?: string | undefined;
    isImage?: boolean | undefined;
};

export type SetSelectTypePayload = {
    documentSubTypeId: number | undefined;
    documentTypeId?: number | undefined;
};

export type SetIndexValuesPayload = {
    indexId?: string[];
    indexValue?: string[];
    mainIndex?: string;
    searchIndex: string;
};

export type SetUploadDetailPayload = {
    documentId?: string;
    documentCode?: string;
    documentSubTypeId: number | undefined;
    mainIndex?: string;
    searchIndex?: string;
    indexId?: string[];
    indexValue?: string[];
};

export type SetDocumentId = {
    documentId?: string;
};

export type SetDocumentFileId = {
    documentFileId: string;
};

//Create Slice
const documentSlice = createSlice({
    name: "document",
    initialState,
    reducers: {
        setDocumentSearch: (state, action: PayloadAction<DocumentSearchValue>) => {
            state.documentTypeId = action.payload.documentTypeId;
            state.documentSubTypeId = action.payload.documentSubTypeId;
            state.searchText = action.payload.searchText;
            state.documentSearchPagination = {
                ...initialState.documentSearchPagination,
            };
        },

        setDocumentSearchPaginated: (state, action: PayloadAction<PaginationSortableDto>) => {
            state.documentSearchPagination = {
                ...state.documentSearchPagination,
                ...action.payload,
            };
        },

        setURLPreview: (state, action: PayloadAction<SetURLPreviewPayload>) => {
            state.url = action.payload.url;
            state.isImage = action.payload.isImage;
        },

        setSelectTypeValue: (state, action: PayloadAction<SetSelectTypePayload>) => {
            state.documentSubTypeId = action.payload.documentSubTypeId;
            state.documentTypeId = action.payload.documentTypeId;
        },
        setIndexValues: (state, action: PayloadAction<SetIndexValuesPayload>) => {
            state.indexId = action.payload.indexId;
            state.indexValue = action.payload.indexValue;
            state.mainIndex = action.payload.mainIndex;
            state.searchIndex = action.payload.searchIndex;
        },
        setDocumentUploadDetail: (state, action: PayloadAction<SetUploadDetailPayload>) => {
            state.documentCode = action.payload.documentCode;
            state.documentId = action.payload.documentId;
            state.documentSubTypeId = action.payload.documentSubTypeId;
            state.mainIndex = action.payload.mainIndex;
            state.searchIndex = action.payload.searchIndex;
            state.indexId = action.payload.indexId;
            state.indexValue = action.payload.indexValue;
            // state = { ...state, ...action.payload };
        },
        setDocumentId: (state, action: PayloadAction<SetDocumentId>) => {
            state.documentId = action.payload.documentId;
        },
        setDocumentFileId: (state, action: PayloadAction<SetDocumentFileId>) => {
            state.documentFileId = action.payload.documentFileId;
        },
        resetToDefault: () => initialState,
    },
});

// สร้าง Action จาก Slice

export const {
    setDocumentSearch,
    setDocumentSearchPaginated,
    setURLPreview,
    setSelectTypeValue,
    setIndexValues,
    setDocumentUploadDetail,
    setDocumentId,
    resetToDefault,
    setDocumentFileId,
} = documentSlice.actions;

export const documentSelector = (state: { document: DocumentStates }) => state.document;

// สร้าง Reducer จาก Slice
export default documentSlice.reducer;
