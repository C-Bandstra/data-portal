import {useEffect} from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridColumns, exportToCSV } from '../../utils';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch } from 'react-redux';
import { setCounts } from '../../redux/slices/statusCountSlice';

function ClaimantUploadsGrid({ rows, height }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const counts = rows.reduce(
            (acc, row) => {
                if (row.completed === "true") acc.completed += 1;
                if (row.delivered === "true") acc.delivered += 1;
                if (row.finishLater === "true") acc.finishLater += 1;
                if (row.declined === "true") acc.declined += 1;
                return acc;
            },
            { completed: 0, delivered: 0, finishLater: 0, declined: 0 }
        );

        // Dispatch counts to Redux
        dispatch(setCounts(counts));
    }, [rows, dispatch]);

    return (
        <Box
            sx={{
                flexDirection: 'column',
                m: '0.5em 0em',
                borderRadius: '6px',
                color: '#32383e',
                width: "100%",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%"}}>
                <Typography variant="h6" color="#000080" sx={{ fontWeight: 500, ml: "0.5em", fontSize: "1.5em" }}>
                    Incoming
                </Typography>
                <Typography sx={{ml: "2em"}} variant="p">Total Claimant Responses: {rows.length}</Typography>
                <Button 
                    onClick={() => exportToCSV(rows, dataGridColumns)} 
                    startIcon={<DownloadIcon />}  
                    variant="contained" 
                    size="small" 
                    sx={{ml: "auto", mr: "0.5em"}}>
                        CSV
                </Button>
            </Box>
            <Box sx={{height: height || 300, width: "100%"}}>
                <DataGrid
                    rows={rows}
                    columns={dataGridColumns}
                    pageSize={3}
                    rowsPerPageOptions={[5]}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
                    }
                    sx={{
                        padding: "0.5em",
                        '& .MuiDataGrid-cell:hover': {
                            color: 'rgba(0,0,128,1.00)',
                        },
                        "& .MuiDataGrid-virtualScrollerRenderZone": {
                            border: "1px solid rgba(0,0,128,.1)",
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "rgba(0,0,128,.025)",
                        },
                        "& .Mui-even": {
                            backgroundColor: "rgba(0,0,128,.05)",
                        },
                    }}
                />
            </Box>
        </Box>
    );
}

export default ClaimantUploadsGrid;