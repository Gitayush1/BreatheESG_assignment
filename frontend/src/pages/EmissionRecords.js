import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ClearAll as ClearIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { emissionRecordsAPI } from '../services/api';

const scopeConfig = {
  SCOPE_1: { label: 'Scope 1', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
  SCOPE_2: { label: 'Scope 2', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
  SCOPE_3: { label: 'Scope 3', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
};

const statusConfig = {
  PENDING: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
  APPROVED: { label: 'Approved', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' },
  REJECTED: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
};

function EmissionRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [rowCount, setRowCount] = useState(0);
  const [filters, setFilters] = useState({
    scope: '',
    status: '',
    search: '',
  });

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page + 1,
        page_size: paginationModel.pageSize,
        ...(filters.scope && { scope: filters.scope }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      };
      const response = await emissionRecordsAPI.getAll(params);
      setRecords(response.data.results || response.data);
      setRowCount(response.data.count || response.data.length);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, filters]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

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
      field: 'facility',
      headerName: 'Facility',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          {params.value || '—'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const config = statusConfig[params.value] || {};
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
      field: 'data_source_name',
      headerName: 'Source',
      width: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          {params.value}
        </Typography>
      ),
    },
  ];

  const hasFilters = filters.scope || filters.status || filters.search;

  return (
    <Box>
      {/* Page header */}
      <Box className="animate-fade-in" sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 0.5,
            background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Emission Records
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Browse and filter all ingested emission data
        </Typography>
      </Box>

      {/* Filters */}
      <Paper className="animate-fade-in-delay-1" sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterIcon sx={{ color: '#64748b', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
            FILTERS
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search categories, facilities..."
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{ minWidth: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#64748b', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Scope"
            variant="outlined"
            size="small"
            value={filters.scope}
            onChange={(e) => setFilters({ ...filters, scope: e.target.value })}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All Scopes</MenuItem>
            <MenuItem value="SCOPE_1">Scope 1</MenuItem>
            <MenuItem value="SCOPE_2">Scope 2</MenuItem>
            <MenuItem value="SCOPE_3">Scope 3</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </TextField>
          {hasFilters && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={() => setFilters({ scope: '', status: '', search: '' })}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                '&:hover': {
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                },
              }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Paper>

      {/* Data Grid */}
      <Paper className="animate-fade-in-delay-2" sx={{ height: 620, width: '100%' }}>
        <DataGrid
          rows={records}
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          rowCount={rowCount}
          paginationMode="server"
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row': {
              transition: 'background-color 0.15s ease',
            },
          }}
        />
      </Paper>
    </Box>
  );
}

export default EmissionRecords;
