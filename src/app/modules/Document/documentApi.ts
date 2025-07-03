//import { useQuery } from "@tanstack/react-query";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../../Const";
import {
    DeleteResponseDtoServiceResponse,
    DocumentByIdResponseDtoServiceResponse,
    DocumentClient,
    DocumentUploaderClient,
    FileParameter,
    MasterClient,
    UploadResponseDtoServiceResponse,
} from "./documentApi.client";

const documentClient = new DocumentClient(API_URL, axios);

const masterClient = new MasterClient(API_URL, axios);

const documentUploaderClient = new DocumentUploaderClient(API_URL, axios);

const documentTypeAllQueryKey = "documentTypeAll";
const documentSubTypeAllQueryKey = "documentSubTypeAll";
const documentAllQueryKey = "documentAll";
const documentIndexAllQueryKey = "documentIndexAll";
const documentByIdGetQueryKey = "documentByIdGet";
const documentLinkByFileIdQueryKey = "documentLinkByFileId";

const documentFileByDocumentIdAllQueryKey = "documentFileByDocumentIdAll";
const documentIndexValueByDocumentIdAllQueryKey = "documentIndexValueByDocumentIdAll";

export const useDocumentTypeGet = (documentTypeId?: number | undefined) => {
    return useQuery([documentTypeAllQueryKey, documentTypeId], () => masterClient.getDocumentType(documentTypeId));
};

export const useDocumentSubTypeGet = (documentTypeId?: number | undefined, documentSubTypeId?: number | undefined) => {
    return useQuery([documentSubTypeAllQueryKey, documentTypeId, documentSubTypeId], () =>
        masterClient.getDocumentSubType(documentTypeId, documentSubTypeId)
    );
};

export const useDocumentTypeGetAfterGetSubType = (documentTypeId?: number | undefined, isEnabled?: boolean) => {
    return useQuery([documentTypeAllQueryKey, documentTypeId], () => masterClient.getDocumentType(documentTypeId), {
        enabled: isEnabled,
    });
};

export const useDocumentIndexGet = (documentSubTypeId: number) => {
    return useQuery([documentIndexAllQueryKey, documentSubTypeId], () =>
        masterClient.getDocumentIndex(documentSubTypeId)
    );
};

export const useDocumentFileLinkGet = (documentFileId: string, isEnabled?: boolean) => {
    return useQuery(
        [documentLinkByFileIdQueryKey, documentFileId],
        () => documentClient.getDocumentFileById(documentFileId),
        {
            enabled: isEnabled,
        }
    );
};

export const useDocumentAllGet = (
    page?: number | undefined,
    recordsPerPage?: number | undefined,
    documentTypeId?: number | undefined,
    documentSubTypeId?: number | undefined,
    searchIndex?: string | undefined,
    sortColumn?: string | undefined,
    ordering?: string | undefined
) => {
    return useQuery(
        [
            documentAllQueryKey,
            page,
            recordsPerPage,
            documentTypeId,
            documentSubTypeId,
            searchIndex,
            sortColumn,
            ordering,
        ],
        () =>
            documentClient.getDocumentAll(
                page,
                recordsPerPage,
                documentTypeId,
                documentSubTypeId,
                searchIndex,
                sortColumn,
                ordering
            )
    );
};

export const useDocumentByIdGet = (documentId: string) => {
    return useQuery([documentByIdGetQueryKey, documentId], () => documentClient.getDocumentById(documentId));
};

export const useDocumentByIdGet_OnLoad = (documentId: string, isEnabled: boolean) => {
    return useQuery([documentByIdGetQueryKey, documentId], () => documentClient.getDocumentById(documentId), {
        enabled: isEnabled,
    });
};

type DocumentCreateData = {
    documentCode?: string | undefined;
    documentId?: string | undefined;
    documentSubTypeId?: number | undefined;
    mainIndex?: string | undefined;
    searchIndex?: string | undefined;
    documentIndexId?: number[] | undefined;
    documentIndexValue?: string[] | undefined;
    fileUploads?: FileParameter[] | undefined;
};

export const useDocumentCreate = (
    onSuccessCallback: (data: UploadResponseDtoServiceResponse) => void,
    onErrorCallback: (error: string) => void
) => {
    const queryClient = useQueryClient();
    return useMutation(
        (data: DocumentCreateData) =>
            documentUploaderClient.documentCreate(
                data.documentCode,
                data.documentId,
                data.documentSubTypeId,
                data.mainIndex,
                data.searchIndex,
                data.documentIndexId,
                data.documentIndexValue,
                data.fileUploads
            ),
        {
            onSuccess: (response) => {
                if (!response.isSuccess)
                    onErrorCallback(response.message || response.exceptionMessage || "Unknown error");
                else onSuccessCallback(response);

                queryClient.invalidateQueries([documentAllQueryKey]);
                queryClient.invalidateQueries([documentByIdGetQueryKey]);
            },
            onError: (error: Error) => {
                onErrorCallback && onErrorCallback(error.message);

                queryClient.invalidateQueries([documentAllQueryKey]);
                queryClient.invalidateQueries([documentByIdGetQueryKey]);
            },
        }
    );
};

type DocumentFileCreateData = {
    document?: FileParameter[] | undefined;
};

export const useDocumentFileUpload = (
    documentid: string,
    onSuccessCallback: (data: UploadResponseDtoServiceResponse) => void,
    onErrorCallback: (error: string) => void
) => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: DocumentFileCreateData) => documentUploaderClient.documentFileCreateById(documentid, body.document),
        {
            onSuccess: (response) => {
                if (!response.isSuccess)
                    onErrorCallback(response.message || response.exceptionMessage || "Unknown error");
                else onSuccessCallback(response);

                queryClient.invalidateQueries([documentAllQueryKey]);
                queryClient.invalidateQueries([documentByIdGetQueryKey, documentid]);
            },
            onError: (error: Error) => {
                onErrorCallback && onErrorCallback(error.message);

                queryClient.invalidateQueries([documentAllQueryKey]);
                queryClient.invalidateQueries([documentByIdGetQueryKey, documentid]);
            },
        }
    );
};

export const useGetDocumentDetail = (
    documentid: string,
    onSuccessCallback: (data: DocumentByIdResponseDtoServiceResponse) => void,
    onErrorCallback: (error: string) => void
) => {
    const queryClient = useQueryClient();
    return useMutation((docid: string) => documentClient.getDocumentById(docid), {
        onSuccess: (response) => {
            if (!response.isSuccess) onErrorCallback(response.message || response.exceptionMessage || "Unknown error");
            else onSuccessCallback(response);

            queryClient.invalidateQueries([documentAllQueryKey]);
            queryClient.invalidateQueries([documentByIdGetQueryKey, documentid]);
        },
        onError: (error: Error) => {
            onErrorCallback && onErrorCallback(error.message);

            queryClient.invalidateQueries([documentAllQueryKey]);
            queryClient.invalidateQueries([documentByIdGetQueryKey, documentid]);
        },
    });
};

type DocumentFileDeleteData = {
    documentfileid: string;
};

export const useDocumentFileDelete = (
    documentid: string,
    onSuccessCallback: (data: DeleteResponseDtoServiceResponse) => void,
    onErrorCallback: (error: string) => void
) => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: DocumentFileDeleteData) => documentUploaderClient.documentDelete(documentid, body.documentfileid),
        {
            onSuccess: (response) => {
                if (!response.isSuccess)
                    onErrorCallback(response.message || response.exceptionMessage || "Unknown error");
                else onSuccessCallback(response);

                queryClient.invalidateQueries([documentAllQueryKey]);
                queryClient.invalidateQueries([documentByIdGetQueryKey, documentid]);
                queryClient.invalidateQueries([documentFileByDocumentIdAllQueryKey, documentid]);
            },
            onError: (error: Error) => {
                onErrorCallback && onErrorCallback(error.message);

                queryClient.invalidateQueries([documentAllQueryKey]);
                queryClient.invalidateQueries([documentByIdGetQueryKey, documentid]);
                queryClient.invalidateQueries([documentFileByDocumentIdAllQueryKey, documentid]);
            },
        }
    );
};

export const useDocumentFileByDocumentIdAll = (
    documentId: string,
    page?: number | undefined,
    recordsPerPage?: number | undefined,
    sortColumn?: string | undefined,
    ordering?: string | undefined,
    isShow: boolean = true
) => {
    return useQuery(
        [documentFileByDocumentIdAllQueryKey, documentId, page, recordsPerPage, sortColumn, ordering, isShow],
        () => documentClient.getDocumentFileByDocumentId(documentId, page, recordsPerPage, sortColumn, ordering, isShow)
    );
};

export const useDocumentIndexValueByDocumentIdAll = (
    documentId: string,
    page?: number | undefined,
    recordsPerPage?: number | undefined,
    sortColumn?: string | undefined,
    ordering?: string | undefined
) => {
    return useQuery(
        [documentIndexValueByDocumentIdAllQueryKey, documentId, page, recordsPerPage, sortColumn, ordering],
        () => documentClient.getDocumentIndexValueByDocumentId(documentId, page, recordsPerPage, sortColumn, ordering)
    );
};

type DocumentFileReUploadData = {
    documentfileid: string;
};

export const useReUploadDocumentFile = (
    documentid: string,
    onSuccessCallback: (data: UploadResponseDtoServiceResponse) => void,
    onErrorCallback: (error: string) => void
) => {
    const queryClient = useQueryClient();
    return useMutation(
        (body: DocumentFileReUploadData) => documentUploaderClient.reupload(documentid, body.documentfileid),
        {
            onSuccess: (response) => {
                if (!response.isSuccess)
                    onErrorCallback(response.message || response.exceptionMessage || "Unknown error");
                else onSuccessCallback(response);

                queryClient.invalidateQueries([documentAllQueryKey]);
                queryClient.invalidateQueries([documentByIdGetQueryKey, documentid]);
                queryClient.invalidateQueries([documentFileByDocumentIdAllQueryKey, documentid]);
            },
            onError: (error: Error) => {
                onErrorCallback && onErrorCallback(error.message);

                queryClient.invalidateQueries([documentAllQueryKey]);
                queryClient.invalidateQueries([documentByIdGetQueryKey, documentid]);
                queryClient.invalidateQueries([documentFileByDocumentIdAllQueryKey, documentid]);
            },
        }
    );
};
