import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { emissionRecordsAPI } from '../services/api';

const scopeConfig = {
  SCOPE_1: { label: 'Scope 1', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
  SCOPE_2: { label: 'Scope 2', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
  SCOPE_3: { label: 'Scope 3', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
};

function DetailItem({ label, children }) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          color: '#64748b',
          fontSize: '0.65rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      {children || (
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          N/A
        </Typography>
      )}
    </Box>
  );
}

function ReviewQueue() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [message, setMessage] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const loadPendingRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await emissionRecordsAPI.getAll({
        status: 'PENDING',
        page: paginationModel.page + 1,
        page_size: paginationModel.pageSize,
      });
      setRecords(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    loadPendingRecords();
  }, [loadPendingRecords]);

  const handleReview = (record) => {
    setSelectedRecord(record);
    setReviewNotes('');
    setMessage(null);
  };

  const handleApprove = async () => {
    try {
      await emissionRecordsAPI.review(selectedRecord.id, {
        status: 'APPROVED',
        review_notes: reviewNotes,
      });
      setMessage({ type: 'success', text: 'Record approved successfully' });
      setSelectedRecord(null);
      loadPendingRecords();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to approve record',
      });
    }
  };

  const handleReject = async () => {
    if (!reviewNotes.trim()) {
      setMessage({ type: 'error', text: 'Please provide rejection notes' });
      return;
    }

    try {
      await emissionRecordsAPI.review(selectedRecord.id, {
        status: 'REJECTED',
        review_notes: reviewNotes,
      });
      setMessage({ type: 'success', text: 'Record rejected successfully' });
      setSelectedRecord(null);
      loadPendingRecords();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to reject record',
      });
    }
  };

  const columns = [
    {
      field: 'activity_date',
      headerName: 'Date',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#e2e8f0', fontSize: '0.8rem' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#e2e8f0', fontSize: '0.8rem' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'scope',
      headerName: 'Scope',
      width: 130,
      renderCell: (params) => {
        const config = scopeConfig[params.value] || {};
        return (
          <Chip
            label={config.label || params.value}
            size="small"
            sx={{
              backgroundColor: config.bg,
              color: config.color,
              border: `1px solid ${config.border}`,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        );
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 110,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {parseFloat(params.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </Typography>
      ),
    },
    {
      field: 'unit',
      headerName: 'Unit',
      width: 80,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'co2_emissions_kg',
      headerName: 'CO₂ (kg)',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {parseFloat(params.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </Typography>
      ),
    },
    {
      field: 'data_source_name',
      headerName: 'Source',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<ViewIcon sx={{ fontSize: 16 }} />}
          onClick={() => handleReview(params.row)}
          sx={{
            borderColor: 'rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            fontSize: '0.75rem',
            py: 0.5,
            '&:hover': {
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
            },
          }}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <Box>
      {/* Page header */}
      <Box className="animate-fade-in" sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Review Queue
          </Typography>
          {records.length > 0 && (
            <Chip
              label={`${records.length} pending`}
              size="small"
              sx={{
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Review and approve or reject pending emission records
        </Typography>
      </Box>

      {message && (
        <Alert
          severity={message.type}
          sx={{
            mb: 3,
            backgroundColor: message.type === 'success'
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${message.type === 'success'
              ? 'rgba(16, 185, 129, 0.2)'
              : 'rgba(239, 68, 68, 0.2)'}`,
            color: message.type === 'success' ? '#6ee7b7' : '#fca5a5',
          }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {records.length === 0 && !loading ? (
        <Paper className="animate-fade-in-delay-1" sx={{ textAlign: 'center', py: 8 }}>
          <PendingIcon sx={{ fontSize: 56, color: '#334155', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 600, mb: 1 }}>
            All caught up!
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            No records pending review. Upload new data to get started.
          </Typography>
        </Paper>
      ) : (
        <Paper className="animate-fade-in-delay-1" sx={{ height: 620, width: '100%' }}>
          <DataGrid
            rows={records}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-row': {
                transition: 'background-color 0.15s ease',
              },
            }}
          />
        </Paper>
      )}

      {/* Review Dialog */}
      <Dialog
        open={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
            Review Emission Record
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Inspect details and approve or reject this record
          </Typography>
        </DialogTitle>

        <DialogContent>
          {selectedRecord && (
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={4}>
                  <DetailItem label="Date">
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                      {selectedRecord.activity_date}
                    </Typography>
                  </DetailItem>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <DetailItem label="Category">
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                      {selectedRecord.category}
                    </Typography>
                  </DetailItem>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <DetailItem label="Scope">
                    {(() => {
                      const config = scopeConfig[selectedRecord.scope] || {};
                      return (
                        <Chip
                          label={config.label || selectedRecord.scope}
                          size="small"
                          sx={{
                            backgroundColor: config.bg,
                            color: config.color,
                            border: `1px solid ${config.border}`,
                            fontWeight: 600,
                            mt: 0.3,
                          }}
                        />
                      );
                    })()}
                  </DetailItem>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <DetailItem label="Activity Type">
                    <Typography variant="body1" sx={{ color: '#e2e8f0' }}>
                      {selectedRecord.activity_type}
                    </Typography>
                  </DetailItem>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <DetailItem label="Quantity">
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace' }}>
                      {parseFloat(selectedRecord.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })} {selectedRecord.unit}
                    </Typography>
                  </DetailItem>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <DetailItem label="CO₂ Emissions">
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                      }}
                    >
                      {parseFloat(selectedRecord.co2_emissions_kg).toLocaleString(undefined, { maximumFractionDigits: 2 })} kg
                    </Typography>
                  </DetailItem>
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Facility">
                    <Typography variant="body1" sx={{ color: '#e2e8f0' }}>
                      {selectedRecord.facility || 'N/A'}
                    </Typography>
                  </DetailItem>
                </Grid>
                <Grid item xs={6}>
                  <DetailItem label="Location">
                    <Typography variant="body1" sx={{ color: '#e2e8f0' }}>
                      {selectedRecord.location || 'N/A'}
                    </Typography>
                  </DetailItem>
                </Grid>
                <Grid item xs={12}>
                  <DetailItem label="Data Source">
                    <Typography variant="body1" sx={{ color: '#e2e8f0' }}>
                      {selectedRecord.data_source_name}
                    </Typography>
                  </DetailItem>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.06)' }} />

              <TextField
                label="Review Notes"
                multiline
                rows={3}
                fullWidth
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add notes about your review decision..."
                helperText="Notes are required for rejections"
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setSelectedRecord(null)}
            sx={{ color: '#94a3b8' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            startIcon={<RejectIcon />}
            sx={{
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              border: '1px solid',
              '&:hover': {
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
              },
            }}
          >
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            variant="contained"
            startIcon={<ApproveIcon />}
            sx={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              fontWeight: 700,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              },
            }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReviewQueue;
