import { useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { combinedColumns } from '../../utils';
import { setCounts } from '../../redux/slices/statusCountSlice';
import { useDispatch, useSelector } from 'react-redux';
import DownloadIcon from '@mui/icons-material/Download';
import { exportToCSV } from '../../utils';

const CombinedGrid = ({ rows, height }) => {
  const dispatch = useDispatch();

  const completedCount = useSelector((state) => state.statusCount.completed);
  const deliveredCount = useSelector((state) => state.statusCount.delivered);
  const finishLaterCount = useSelector((state) => state.statusCount.finishLater);
  const declinedCount = useSelector((state) => state.statusCount.declined);
  const authFailureCount = useSelector((state) => state.statusCount.authFailure);

  useEffect(() => {
      const counts = rows.reduce(
          (acc, row) => {
              if (row.completed === "true") acc.completed += 1;
              if (row.delivered === "true") acc.delivered += 1;
              if (row.finishLater === "true") acc.finishLater += 1;
              if (row.declined === "true") acc.declined += 1;
              if (row.authFailure === "true") acc.authFailure += 1;
              return acc;
          },
          { completed: 0, delivered: 0, finishLater: 0, declined: 0, authFailure: 0 }
      );
      // Dispatch counts to Redux
      dispatch(setCounts(counts));
  }, [rows, dispatch]);

  return (
      <Paper
        sx={{
          // display: 'flex',
          flexDirection: 'column',
          m: '0.5em 0em',
          borderRadius: '6px',
          color: '#32383e',
          flexGrow: 1,
          pt: "6px"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center"}}>
          {/* <Typography variant="h6" color="#000080" sx={{ fontWeight: 500, ml: "0.5em", fontSize: "1.5em" }}>
              Campaign Details
          </Typography> */}
          <Typography sx={{ml: "2em"}} variant="p">Total Alerts: {rows.length}</Typography>
          <Typography sx={{ml: "2em"}} variant="p">Completed: {completedCount}</Typography>
          <Typography sx={{ml: "2em"}} variant="p">Delivered: {deliveredCount}</Typography>
          <Typography sx={{ml: "2em"}} variant="p">Finish Later: {finishLaterCount}</Typography>
          <Typography sx={{ml: "2em"}} variant="p">Declined: {declinedCount}</Typography>
          <Typography sx={{ml: "2em"}} variant="p">Auth Failures: {authFailureCount}</Typography>
          <Button 
            onClick={() => exportToCSV(rows, combinedColumns)} 
            variant="contained" 
            startIcon={<DownloadIcon />} 
            size="small" 
            sx={{ml: "auto", mr: "0.5em"}}>
              CSV
          </Button>
        </Box>
        <Box sx={{height: height || 475, width: "100%", pt: "6px"}}>
          <DataGrid
            rows={rows}
            columns={combinedColumns}
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
                // "& .MuiDataGrid-virtualScrollerRenderZone": {
                //     border: "1px solid rgba(0,0,128,.1)",
                // },
                "& .MuiDataGrid-row:hover": {
                    backgroundColor: "rgba(0,0,128,.025)",
                },
                "& .Mui-even": {
                    backgroundColor: "rgba(0,0,128,.05)",
                },
            }}
          />
        </Box>
      </Paper>
  )
}

export default CombinedGrid;