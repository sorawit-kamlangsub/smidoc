import { Grid } from "@mui/material";
// import { useGetFavoriteFoodPagination } from "../documentApi";

const DocumentIndexDatatable = () => {
    // const [paginated, setPaginated] = React.useState<PaginationSortableDto>({
    //     page: 1,
    //     recordsPerPage: 5,
    // });

    // const { data, isLoading, error } = useGetFavoriteFoodPagination(paginated);

    // const pagination: PaginationResultDto = useMemo(
    //     () => ({
    //         totalAmountRecords: data?.totalAmountRecords ?? 0,
    //         totalAmountPages: data?.totalAmountPages ?? 0,
    //         currentPage: data?.currentPage ?? 0,
    //         recordsPerPage: data?.recordsPerPage ?? 0,
    //         pageIndex: data?.pageIndex ?? 0,
    //     }),
    //     [data]
    // );

    // const columns: MUIDataTableColumn[] = [
    //     { name: "id", label: "ID", options: { filter: false, sort: true } },
    //     { name: "name", label: "Name", options: { filter: true, sort: true } },
    //     { name: "categoryId", label: "Category ID", options: { filter: true, sort: true } },
    // ];

    return (
        <Grid container direction={"row"}>
            <Grid item xs={12}>
                {/* <StandardDataTable
                    name="documentFileList"
                    title=""
                    data={data?.data ?? []}
                    isLoading={isLoading}
                    columns={columns}
                    paginated={pagination}
                    setPaginated={setPaginated}
                    color="primary"
                    displayFooter={false}
                /> */}
            </Grid>
        </Grid>
    );
};

export default DocumentIndexDatatable;
