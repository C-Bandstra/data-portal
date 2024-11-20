import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { documentAlertsColumns, exportToCSV } from '../../utils';
import DownloadIcon from '@mui/icons-material/Download';
import { useSelector } from 'react-redux';

function DocumentAlertsGrid({ rows, small }) {
    const completedCount = useSelector((state) => state.statusCount.completed);
    const deliveredCount = useSelector((state) => state.statusCount.delivered);
    const finishLaterCount = useSelector((state) => state.statusCount.finishLater);
    const declinedCount = useSelector((state) => state.statusCount.declined);

    return (
        <Box
            sx={{
                // display: 'flex',
                flexDirection: 'column',
                m: '0.5em 0em',
                borderRadius: '6px',
                color: '#32383e',
                flexGrow: 1,
            }}
        >
          <Box sx={{ display: "flex", alignItems: "center"}}>
            <Typography variant="h6" color="#000080" sx={{ fontWeight: 500, ml: "0.5em", fontSize: "1.5em" }}>
                Outgoing
            </Typography>
            <Typography sx={{ml: "2em"}} variant="p">Total Alerts: {rows.length}</Typography>
            <Typography sx={{ml: "2em"}} variant="p">Completed: {completedCount}</Typography>
            <Typography sx={{ml: "2em"}} variant="p">Delivered: {deliveredCount}</Typography>
            <Typography sx={{ml: "2em"}} variant="p">Finish Later: {finishLaterCount}</Typography>
            <Typography sx={{ml: "2em"}} variant="p">Declined: {declinedCount}</Typography>
            <Button 
              onClick={() => exportToCSV(rows, documentAlertsColumns)} 
              variant="contained" 
              startIcon={<DownloadIcon />} 
              size="small" 
              sx={{ml: "auto", mr: "0.5em"}}>
                CSV
            </Button>
          </Box>
            <Box sx={{height: 300, width: "100%"}}>
                <DataGrid
                    rows={rows}
                    columns={documentAlertsColumns}
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

export default DocumentAlertsGrid;