import { PermissionList } from "../../Const";
import DocumentAddPage from "../modules/Document/pages/DocumentAddPage";
import DocumentPage from "../modules/Document/pages/DocumentPage";
import DocumentPreviewPage from "../modules/Document/pages/DocumentPreviewPage";
import DocumentPreviewSssSmilePage from "../modules/Document/pages/DocumentPreviewSssSmilePage";
import DocumentScanPage from "../modules/Document/pages/DocumentScanPage";
import DocumentScanUpdatePage from "../modules/Document/pages/DocumentScanUpdatePage";
import BlankPage from "../pages/BlankPage";
import { RouteMapType } from "./AuthRoutes";

/**
 * Config ของ route ของ Project
 *
 * รูปแบบของ Config นี้ จะมี ดังนี้
 * ```
 * {
 *         path: string,            // ที่อยู่ของ path url ที่จะใช้
 *        title: string,            // ชื่อของหน้าที่จะใช้แสดง
 *      element: JSX.Element,       // หน้าที่จะใช้แสดง
 *    children?: RouteMapType[],    // ถ้ามี children จะเป็นการกำหนด route ของหน้านั้นๆ
 *       index?: boolean,           // ถ้าเป็น true ต้ว Element จะเป็นหน้าแรกที่จะแสดง
 * permissions?: string[],          // กำหนด permission ที่จะใช้เข้าถึงหน้านี้ได้
 *   condition?: "AND" | "OR",      // กำหนดว่า permission เป็นการ AND หรือ OR
 * }
 * ```
 */

const Routes: RouteMapType[] = [
    {
        path: "/blank-page",
        title: "Blank Page",
        element: <BlankPage body="Blank Page" />,
    },
    {
        path: "/test-permission",
        title: "Test Page",
        element: <BlankPage body="Test Permission" />,
        permissions: [PermissionList.employee_read, PermissionList.employee_write],
        condition: "AND",
    },
    {
        path: "/document",
        title: "ค้นหาเอกสาร",
        element: <DocumentPage />,
    },

    {
        path: "/document",
        title: "เอกสาร",
        children: [
            { path: "add", title: "เพิ่มเอกสาร", element: <DocumentAddPage /> },
            { path: "scan", title: "สแกนเอกสาร", element: <DocumentScanPage /> },
            { path: ":docId/scan", title: "สแกนเอกสารเพิ่มเติม", element: <DocumentScanPage /> },
            { path: ":docId/scanUpdate", title: "สแกนเอกสารเพิ่มเติม", element: <DocumentScanUpdatePage /> },
        ],
    },
    {
        path: "/document/:documentId/preview",
        title: "Preview Document",
        element: <DocumentPreviewPage />,
    },
    {
        path: "/document/sss-smile-preview/:documentId",
        title: "Preview Document",
        element: <DocumentPreviewSssSmilePage />,
    },
];

export default Routes;
