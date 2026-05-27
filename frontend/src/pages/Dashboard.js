import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  PendingActions as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Factory as FactoryIcon,
  ElectricBolt as BoltIcon,
  FlightTakeoff as FlightIcon,
} from '@mui/icons-material';
import { emissionRecordsAPI } from '../services/api';

function StatCard({ title, value, subtitle, icon, gradient, delay }) {
  return (
    <Card
      className={`animate-fade-in-delay-${delay}`}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: gradient,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: '#64748b', mb: 1, fontSize: '0.7rem' }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: '2rem',
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: `${gradient.replace('linear-gradient', 'linear-gradient')}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.15,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 26, color: '#fff' } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function ScopeCard({ scope, data, icon, color, gradient, delay }) {
  const total = data?.total_emissions_kg || 0;
  const count = data?.count || 0;

  return (
    <Box
      className={`animate-fade-in-delay-${delay}`}
      sx={{
        p: 2.5,
        borderRadius: '14px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${color}33`,
          background: `${color}08`,
          transform: 'translateX(4px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.85rem' }}>
            {scope}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {count} record{count !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
            {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            kg CO₂
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function StatusBar({ label, count, total, color }) {
  const percent = total > 0 ? (count / total) * 100 : 0;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#e2e8f0', fontSize: '0.85rem' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color }}>
          {count}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            backgroundColor: color,
          },
        }}
      />
    </Box>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await emissionRecordsAPI.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress
            size={48}
            thickness={3}
            sx={{
              color: '#10b981',
              mb: 2,
            }}
          />
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Loading dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  const totalRecords = stats?.total_records || 0;
  const pendingCount = stats?.by_status?.PENDING || 0;
  const approvedCount = stats?.by_status?.APPROVED || 0;
  const rejectedCount = stats?.by_status?.REJECTED || 0;

  return (
    <Box>
      {/* Page header */}
      <Box className="animate-fade-in" sx={{ mb: 4 }}>
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
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Overview of your emissions data and review pipeline
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TOTAL RECORDS"
            value={totalRecords}
            subtitle="All emission entries"
            icon={<AssessmentIcon />}
            gradient="linear-gradient(135deg, #3b82f6, #06b6d4)"
            delay={1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="TOTAL EMISSIONS"
            value={`${((stats?.total_emissions_kg || 0) / 1000).toFixed(1)}t`}
            subtitle="CO₂ equivalent"
            icon={<TrendingUpIcon />}
            gradient="linear-gradient(135deg, #ef4444, #f59e0b)"
            delay={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="PENDING REVIEW"
            value={pendingCount}
            subtitle="Awaiting analyst action"
            icon={<PendingIcon />}
            gradient="linear-gradient(135deg, #f59e0b, #eab308)"
            delay={3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="APPROVED"
            value={approvedCount}
            subtitle="Verified records"
            icon={<CheckCircleIcon />}
            gradient="linear-gradient(135deg, #10b981, #06b6d4)"
            delay={4}
          />
        </Grid>
      </Grid>

      {/* Bottom section */}
      <Grid container spacing={3}>
        {/* Emissions by Scope */}
        <Grid item xs={12} md={7}>
          <Card className="animate-fade-in-delay-2" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 3, color: '#f1f5f9', fontSize: '1rem' }}
              >
                Emissions by Scope
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <ScopeCard
                  scope="Scope 1 — Direct Emissions"
                  data={stats?.by_scope?.SCOPE_1}
                  icon={<FactoryIcon sx={{ color: '#fff', fontSize: 20 }} />}
                  color="#ef4444"
                  gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.5))"
                  delay={1}
                />
                <ScopeCard
                  scope="Scope 2 — Energy Indirect"
                  data={stats?.by_scope?.SCOPE_2}
                  icon={<BoltIcon sx={{ color: '#fff', fontSize: 20 }} />}
                  color="#f59e0b"
                  gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(245, 158, 11, 0.5))"
                  delay={2}
                />
                <ScopeCard
                  scope="Scope 3 — Other Indirect"
                  data={stats?.by_scope?.SCOPE_3}
                  icon={<FlightIcon sx={{ color: '#fff', fontSize: 20 }} />}
                  color="#3b82f6"
                  gradient="linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.5))"
                  delay={3}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Review Status */}
        <Grid item xs={12} md={5}>
          <Card className="animate-fade-in-delay-3" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 3, color: '#f1f5f9', fontSize: '1rem' }}
              >
                Review Pipeline
              </Typography>
              <StatusBar
                label="Pending"
                count={pendingCount}
                total={totalRecords}
                color="#f59e0b"
              />
              <StatusBar
                label="Approved"
                count={approvedCount}
                total={totalRecords}
                color="#10b981"
              />
              <StatusBar
                label="Rejected"
                count={rejectedCount}
                total={totalRecords}
                color="#ef4444"
              />

              {/* Summary footer */}
              <Box
                sx={{
                  mt: 3,
                  pt: 2.5,
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Total processed
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f1f5f9' }}>
                  {totalRecords}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
