import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_DOCUMENT_V2 } from "../../../Const";
import { SSSDocClient, SmileDocClient } from "./documentSssSmileApi.client";

const documentSSSDocClient = new SSSDocClient(API_DOCUMENT_V2, axios);
const documentSmileDocClient = new SmileDocClient(API_DOCUMENT_V2, axios);

const documentSSSDocQuerykey = "documentSSSDoc";
const documentSmileQuerykey = "documentSmile";

export const useGetDocumentSSSDoc = (
    documentId: string,
    page?: number | undefined,
    recordsPerPage?: number | undefined,
    orderingField?: string | undefined,
    ascendingOrder?: boolean | undefined
) => {
    return useQuery([documentSSSDocQuerykey, documentId, page, recordsPerPage, orderingField, ascendingOrder], () =>
        documentSSSDocClient.getSSSDocuemntsFilesByDocumentId(
            documentId,
            page,
            recordsPerPage,
            orderingField,
            ascendingOrder
        )
    );
};

export const useGetDocumentSmileDoc = (
    documentId: string,
    page?: number | undefined,
    recordsPerPage?: number | undefined,
    orderingField?: string | undefined,
    ascendingOrder?: boolean | undefined
) => {
    return useQuery([documentSmileQuerykey], () =>
        documentSmileDocClient.getSmileDocumentsFilesByDocumentId(
            documentId,
            page,
            recordsPerPage,
            orderingField,
            ascendingOrder
        )
    );
};
