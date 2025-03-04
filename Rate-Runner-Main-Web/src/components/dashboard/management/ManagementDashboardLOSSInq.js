import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box
} from '@material-ui/core';

const ManagementDashboardLOSSInq = () => {
  const data = {
    revenue: '5,850,000.00',
    gp: '1,200,000.00',
    inquiry: '1,000',
    percent: 100
  };

  return (
    <Card>
      <CardHeader
        disableTypography
        title={(
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="left"
          >
            <Typography
              color="textPrimary"
              variant="h5"
            >
              LOSS Inquiry
            </Typography>
          </Grid>
        )}
      />
      <CardContent sx={{
        alignItems: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        m: -1,
        p: 2
      }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            pl: 3
          }}
        >
          <div>
            <Typography
              color="textPrimary"
              sx={{ mt: 1 }}
              variant="h6"
            >
              Revenue :&nbsp;
              {data.revenue}
            </Typography>
            <Typography
              color="textPrimary"
              sx={{ mt: 1 }}
              variant="h6"
            >
              G/P :&nbsp;
              {data.gp}
            </Typography>
            <Typography
              color="textPrimary"
              sx={{ mt: 1 }}
              variant="h6"
            >
              Inquiry :&nbsp;
              {data.inquiry}
            </Typography>
          </div>
        </Box>
        <Grid
          xl={6}
          md={6}
          xs={12}
        >
          <Grid
            container
            direction="column"
            justifyContent="flex-end"
            alignItems="center"
            sx={{
              mt: 4,
              ml: 4
            }}
          >
            <Typography
              variant="h2"
            >
              {data.percent}
              &nbsp;%
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ManagementDashboardLOSSInq;
