import { Typography, Box, Paper, Grid, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Layout from '../components/Layout';
import { GetStaticProps } from 'next';

export default function Home() {
  const t = useTranslations();
  
  return (
    <Layout>
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('home.welcome')}
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          {t('home.description')}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {t('diary.newEntry')}
              </Typography>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                {t('diary.create')}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {t('diary.recentEntries')}
              </Typography>
              <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }}>
                {t('diary.viewAll')}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {t('settings.profile')}
              </Typography>
              <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
                {t('settings.manage')}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
} 