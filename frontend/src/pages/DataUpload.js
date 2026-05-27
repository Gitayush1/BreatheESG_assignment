import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  CheckCircleOutline as SuccessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { dataSourcesAPI, uploadsAPI } from '../services/api';

const statusConfig = {
  UPLOADED: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
  PROCESSING: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
  COMPLETED: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' },
  FAILED: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
};

function DataUpload() {
  const [dataSources, setDataSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDataSources();
    loadUploads();
  }, []);

  const loadDataSources = async () => {
    try {
      const response = await dataSourcesAPI.getAll();
      setDataSources(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading data sources:', error);
    }
  };

  const loadUploads = async () => {
    try {
      const response = await uploadsAPI.getAll();
      setUploads(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading uploads:', error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedSource) {
      setMessage({ type: 'error', text: 'Please select a data source and file' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('data_source', selectedSource);
      formData.append('original_filename', file.name);

      const source = dataSources.find(ds => ds.id === parseInt(selectedSource));
      if (source) {
        formData.append('organization', source.organization);
      }

      await uploadsAPI.create(formData);
      setMessage({ type: 'success', text: 'File uploaded and processing started!' });
      setFile(null);
      setSelectedSource('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(loadUploads, 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Upload failed. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
          Upload Data
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Ingest emission data from CSV or Excel files
        </Typography>
      </Box>

      {/* Upload Card */}
      <Paper className="animate-fade-in-delay-1" sx={{ p: 4, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#f1f5f9', fontSize: '1rem' }}>
          Upload New File
        </Typography>

        {message && (
          <Alert
            severity={message.type}
            icon={message.type === 'success' ? <SuccessIcon /> : undefined}
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
          >
            {message.text}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 560 }}>
          {/* Data source selector */}
          <TextField
            select
            label="Data Source"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            fullWidth
            disabled={uploading}
          >
            {dataSources.map((source) => (
              <MenuItem key={source.id} value={source.id}>
                {source.name} ({source.source_type})
              </MenuItem>
            ))}
          </TextField>

          {/* Drop zone */}
          <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              p: 4,
              borderRadius: '14px',
              border: `2px dashed ${isDragging ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
              background: isDragging
                ? 'rgba(16, 185, 129, 0.05)'
                : 'rgba(255, 255, 255, 0.01)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              '&:hover': {
                borderColor: 'rgba(16, 185, 129, 0.3)',
                background: 'rgba(16, 185, 129, 0.03)',
              },
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
            />

            {file ? (
              <Box>
                <FileIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#f1f5f9', mb: 0.5 }}>
                  {file.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {formatFileSize(file.size)} · Click or drag to replace
                </Typography>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 40, color: '#64748b', mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#94a3b8', mb: 0.5 }}>
                  Drop your file here or click to browse
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Supports CSV, XLSX, XLS
                </Typography>
              </Box>
            )}
          </Box>

          {/* Upload button */}
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || !selectedSource || uploading}
            startIcon={<UploadIcon />}
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              fontWeight: 700,
              fontSize: '0.9rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            {uploading ? 'Processing...' : 'Upload & Process'}
          </Button>

          {uploading && <LinearProgress sx={{ borderRadius: 2 }} />}
        </Box>

        {/* Format info */}
        <Box
          sx={{
            mt: 4,
            p: 2.5,
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.04)',
            border: '1px solid rgba(59, 130, 246, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <InfoIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ color: '#3b82f6', fontSize: '0.7rem' }}>
              EXPECTED COLUMN FORMATS
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            {[
              { label: 'SAP', cols: 'Date, Material, Quantity, Unit, Plant, Cost_Center' },
              { label: 'Utility', cols: 'Invoice_Date, Utility_Type, Usage, Unit, Meter_ID, Location' },
              { label: 'Travel', cols: 'Travel_Date, Travel_Type, Distance, Unit, Origin, Destination, Employee_ID' },
            ].map((fmt) => (
              <Box key={fmt.label} sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline' }}>
                <Chip
                  label={fmt.label}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#94a3b8',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    height: 22,
                    minWidth: 60,
                  }}
                />
                <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.72rem' }}>
                  {fmt.cols}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Upload History */}
      <Paper className="animate-fade-in-delay-2" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#f1f5f9', fontSize: '1rem' }}>
          Recent Uploads
        </Typography>

        {uploads.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <UploadIcon sx={{ fontSize: 48, color: '#334155', mb: 1.5 }} />
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              No uploads yet. Start by uploading a file above.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Processed</TableCell>
                  <TableCell align="right">Created</TableCell>
                  <TableCell align="right">Failed</TableCell>
                  <TableCell>Uploaded</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploads.map((upload) => {
                  const config = statusConfig[upload.status] || {};
                  return (
                    <TableRow
                      key={upload.id}
                      sx={{
                        transition: 'background-color 0.15s ease',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <FileIcon sx={{ color: '#64748b', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#e2e8f0', fontSize: '0.8rem' }}>
                            {upload.original_filename}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                          {upload.data_source_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={upload.status}
                          size="small"
                          sx={{
                            backgroundColor: config.bg,
                            color: config.color,
                            border: `1px solid ${config.border}`,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.8rem' }}>
                          {upload.records_processed}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#10b981', fontWeight: 600, fontSize: '0.8rem' }}>
                          {upload.records_created}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            color: upload.records_failed > 0 ? '#ef4444' : '#64748b',
                            fontWeight: upload.records_failed > 0 ? 600 : 400,
                            fontSize: '0.8rem',
                          }}
                        >
                          {upload.records_failed}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {new Date(upload.uploaded_at).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default DataUpload;
