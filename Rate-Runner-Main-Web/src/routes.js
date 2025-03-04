import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import LoadingScreen from './components/LoadingScreen';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// mock data

const Browse = Loadable(lazy(() => import('./pages/browse/Browse')));
const BrowseButtons = Loadable(lazy(() => import('./pages/browse/BrowseButtons')));
const BrowseDetailLists = Loadable(lazy(() => import('./pages/browse/BrowseDetailLists')));
const user = JSON.parse(window.localStorage.getItem('user'));

// Authentication pages

const Login = Loadable(lazy(() => import('./pages/authentication/Login')));
const PasswordRecovery = Loadable(lazy(() => import('./pages/authentication/PasswordRecovery')));

// web pages

const InquiryStatus = Loadable(lazy(() => import('./pages/dashboard/InquiryStatus')));
const ManagementDashboard = Loadable(lazy(() => import('./pages/dashboard/Mainmanagement')));
const ReportInqPerformance = Loadable(lazy(() => import('./pages/dashboard/ReportInqPerformance')));
const ReportSalesPerformance = Loadable(lazy(() => import('./pages/dashboard/ReportSalesPerformance')));
const ReportSalesForecast = Loadable(lazy(() => import('./pages/dashboard/ReportSalesForecast')));
const ReportCustomerGpRevenue = Loadable(lazy(() => import('./pages/dashboard/ReportCustomerGpRevenue')));
const ReportCustomerPerformance = Loadable(lazy(() => import('./pages/dashboard/ReportCustomerPerformance')));
const ReportMouthlySalesForecast = Loadable(lazy(() => import('./pages/dashboard/ReportMouthlySalesForecast')));
const ReportBooking = Loadable(lazy(() => import('./pages/dashboard/ReportBooking')));
const ReportInqInformation = Loadable(lazy(() => import('./pages/dashboard/ReportInqInformation')));
const ReportTopCustomerinq = Loadable(lazy(() => import('./pages/dashboard/ReportTopCustomerinq')));
const InquiryStatusDetails = Loadable(lazy(() => import('./pages/dashboard/InquiryStatusDetails')));
const InquiryList = Loadable(lazy(() => import('./pages/dashboard/InquiryList')));
const InquiryDetails = Loadable(lazy(() => import('./pages/dashboard/InquiryDetails')));
const QuotationList = Loadable(lazy(() => import('./pages/dashboard/QuotationList')));
const QuotationDetails = Loadable(lazy(() => import('./pages/dashboard/QuotationDetails')));
const UpdateQuotationResult = Loadable(lazy(() => import('./pages/dashboard/UpdateQuotationResult')));
const UpdateQuotationResultDetails = Loadable(lazy(() => import('./pages/dashboard/UpdateQuotationResultDetails')));
const MonthlySalesForecast = Loadable(lazy(() => import('./pages/dashboard/MonthlySalesForecast')));
const ReMonthlySalesForecast = Loadable(lazy(() => import('./pages/dashboard/ReMonthlySalesForecast')));
const CustomerProfile = Loadable(lazy(() => import('./pages/dashboard/CustomerProfile')));
const CustomerProfileDetails = Loadable(lazy(() => import('./pages/dashboard/CustomerProfileDetails')));
const SalesProfile = Loadable(lazy(() => import('./pages/dashboard/SalesProfile')));
const CityCountry = Loadable(lazy(() => import('./pages/dashboard/CityCountry')));
const PortTable = Loadable(lazy(() => import('./pages/dashboard/PortTable')));
const UserTable = Loadable(lazy(() => import('./pages/dashboard/UserTable')));
const CalendarTable = Loadable(lazy(() => import('./pages/dashboard/CalendarTable')));
const AgentProfile = Loadable(lazy(() => import('./pages/dashboard/AgentProfile')));
const AgentProfileDetails = Loadable(lazy(() => import('./pages/dashboard/AgentProfileDetails')));
const ReferenceCalendar = Loadable(lazy(() => import('./pages/dashboard/ReferenceCalendar')));
const CarrierTable = Loadable(lazy(() => import('./pages/dashboard/CarrierTable')));
const CarrierTableDetails = Loadable(lazy(() => import('./pages/dashboard/CarrierTableDetails')));
const CompetitorTable = Loadable(lazy(() => import('./pages/dashboard/CompetitorTable')));
const CompetitorTableDetails = Loadable(lazy(() => import('./pages/dashboard/CompetitorTableDetails')));
const MonthlySalesForecastDetails = Loadable(lazy(() => import('./pages/dashboard/MonthlySalesForecastDetails')));
const Reporttop10 = Loadable(lazy(() => import('./pages/dashboard/Report-top10')));
const Mainmanagement = Loadable(lazy(() => import('./pages/dashboard/Mainmanagement')));
const RateTable = Loadable(lazy(() => import('./pages/dashboard/RateTable')));
const ExportRateTable = Loadable(lazy(() => import('./pages/dashboard/ExportRateTable')));
const RateTableDetails = Loadable(lazy(() => import('./pages/dashboard/RateTableDetails')));
const UserDetails = Loadable(lazy(() => import('./pages/dashboard/UserDetails')));
const UserReset = Loadable(lazy(() => import('./pages/dashboard/UserReset')));
const Recommend = Loadable(lazy(() => import('./pages/dashboard/Recommend')));
const RecommendDetails = Loadable(lazy(() => import('./pages/dashboard/RecommendDetails')));
const Leadtime = Loadable(lazy(() => import('./pages/dashboard/LeadtimeDetails')));
// Error pages

const AuthorizationRequired = Loadable(lazy(() => import('./pages/AuthorizationRequired')));
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const ServerError = Loadable(lazy(() => import('./pages/ServerError')));

const routes = [
  {
    path: '*',
    children: [
      {
        path: '/',
        element: <Login />
      },
      {
        path: 'password-recovery',
        element: <PasswordRecovery />
      }
    ]
  },
  {
    path: 'main',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: (user) ? ((user.user_role === 'systemAdmin') && <UserTable />)
        || ((user.user_role === 'dataAdmin') && <ReportBooking />)
        || ((user.user_role !== 'systemAdmin' && user.user_role !== 'dataAdmin') && <InquiryStatus />) : <InquiryStatus />
      },
      {
        path: 'inquiry-status',
        children: [
          {
            path: '/',
            element: <InquiryStatus />
          },
          {
            path: 'details',
            element: <InquiryStatusDetails />
          },
          {
            path: 'details/:inqID',
            element: <InquiryStatusDetails />
          }
        ]
      },
      {
        path: 'Management-Dashboard',
        children: [
          {
            path: '/',
            element: <ManagementDashboard />
          }
        ]
      },
      {
        path: 'inquiry',

        children: [
          {
            path: '/',
            element: <InquiryList />
          },
          {
            path: 'details',
            element: <InquiryDetails />
          },
          {
            path: 'details/:inqID',
            element: <InquiryDetails />
          }
        ]
      },
      {
        path: 'quotation-draft',

        children: [
          {
            path: '/',
            element: <QuotationList />
          },
          {
            path: 'details',
            element: <QuotationDetails />
          },
          {
            path: 'details/:quoID',
            element: <QuotationDetails />
          },
        ]
      },
      {
        path: 'forecast',

        children: [
          {
            path: '/',
            element: <MonthlySalesForecast />
          },
          {
            path: 'reforecast',
            element: <ReMonthlySalesForecast />
          },
          {
            path: 'details',
            element: <MonthlySalesForecastDetails />
          },
          {
            path: 'details/:forecastID',
            element: <MonthlySalesForecastDetails />
          },
          {
            path: 'details/:forecastID/:mode',
            element: <MonthlySalesForecastDetails />
          },
        ]
      },
      {
        path: 'update-result',

        children: [
          {
            path: '/',
            element: <UpdateQuotationResult />
          },
          {
            path: 'details',
            element: <UpdateQuotationResultDetails />
          },
          {
            path: 'details/:updateID',
            element: <UpdateQuotationResultDetails />
          },
        ]
      },
      {
        path: 'Recommend',

        children: [
          {
            path: '/',
            element: <Recommend />
          },
          {
            path: 'details',
            element: <RecommendDetails />
          },
          {
            path: 'details/:recommendID',
            element: <RecommendDetails />
          },
        ]
      }, /*      {
        path: 'SALESMANAGER',
        element: <InquiryStatus />
      },
      {
        path: 'MARKETING',
        element: <InquiryStatus />
      },
      {
        path: 'MARKETINGMANAGER',
        element: <InquiryStatus />
      },
      {
        path: 'MANAGEMENT',
        element: <InquiryStatus />
      },
      {
        path: 'SYSTEMADMIN',
        element: <InquiryStatus />
      },
      {
        path: 'Reporttop10',
        element: <Reporttop10 />
      }, */
      {
        path: '/management-dashboard',
        element: <Mainmanagement />
      },
      {
        path: '401',
        element: <AuthorizationRequired />
      },
      {
        path: '404',
        element: <NotFound />
      },
      {
        path: '500',
        element: <ServerError />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: 'report',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/export-rate',
        element: <ExportRateTable />
      },
      {
        path: '/top-10',
        element: <Reporttop10 />
      },
      {
        path: '/inquiry-performance',
        element: <ReportInqPerformance />
      },
      {
        path: '/sales-performance',
        element: <ReportSalesPerformance />
      },
      {
        path: '/inquiry-information',
        element: <ReportInqInformation />
      },
      {
        path: '/booking',
        element: <ReportBooking />
      },
      {
        path: '/inquiry-information/:quoID',
        element: <ReportInqInformation />
      },
      {
        path: '/forecast-vs-actual',
        element: <ReportSalesForecast />
      },
      {
        path: '/revenue-gp',
        element: <ReportCustomerGpRevenue />
      },
      {
        path: '/customer-performance',
        element: <ReportCustomerPerformance />
      },
      {
        path: '/top-10-customer',
        element: <ReportTopCustomerinq />
      },
      {
        path: '/mouthly-report',
        element: <ReportMouthlySalesForecast />
      }
    ]
  },
  {
    path: 'setup-data',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/calendar',
        element: <Browse />
      },
      {
        path: '/authorized',
        element: <BrowseButtons />
      },
      {
        path: '/profile',
        element: <UserDetails />
      },
      {
        path: '/reset',
        element: <UserReset />
      }
    ]
  },
  {
    path: 'reset',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'password',

        children: [
          {
            path: '/:userID',
            element: <UserReset />
          }
        ]
      }
    ]
  },
  {
    path: 'reference-data',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'rate-table',

        children: [
          {
            path: '/',
            element: <RateTable />
          },
          {
            path: 'details/:rateId',
            element: <RateTableDetails />
          },
          {
            path: 'details',
            element: <RateTableDetails />
          },
        ]
      },
      {
        path: 'customer',

        children: [
          {
            path: '/',
            element: <CustomerProfile />
          },
          {
            path: 'details/:cusId',
            element: <CustomerProfileDetails />
          },
          {
            path: 'details',
            element: <CustomerProfileDetails />
          },
        ]
      },
      {
        path: 'sales',

        children: [
          {
            path: '/',
            element: <SalesProfile />
          }
        ]
      },
      {
        path: 'city',

        children: [
          {
            path: '/',
            element: <CityCountry />
          }
        ]
      },
      {
        path: 'port',

        children: [
          {
            path: '/',
            element: <PortTable />
          }
        ]
      },
      {
        path: 'user',

        children: [
          {
            path: '/',
            element: <UserTable />
          }
        ]
      },
      {
        path: 'calendar',

        children: [
          {
            path: '/',
            element: <CalendarTable />
          }
        ]
      },
      {
        path: 'calendar',

        children: [
          {
            path: '/',
            element: <ReferenceCalendar />
          },
          {
            path: 'details/:calendarId',
            element: <AgentProfileDetails />
          },
          {
            path: 'details',
            element: <AgentProfileDetails />
          },
        ]
      },
      {
        path: 'agent',

        children: [
          {
            path: '/',
            element: <AgentProfile />
          },
          {
            path: 'details/:agentId',
            element: <AgentProfileDetails />
          },
          {
            path: 'details',
            element: <AgentProfileDetails />
          },
        ]
      },
      {
        path: 'carrier',

        children: [
          {
            path: '/',
            element: <CarrierTable />
          },
          {
            path: 'details/:carrierId',
            element: <CarrierTableDetails />
          },
          {
            path: 'details',
            element: <CarrierTableDetails />
          },
        ]
      },
      {
        path: 'competitor',

        children: [
          {
            path: '/',
            element: <CompetitorTable />
          },
          {
            path: 'details/:compId',
            element: <CompetitorTableDetails />
          },
          {
            path: 'details',
            element: <CompetitorTableDetails />
          },
        ]
      },
      {
        path: '/lead-time',
        children: [
          {
            path: '/',
            element: <Leadtime />
          }
        ]
      },
      {
        path: '/export-data',
        element: <BrowseDetailLists />
      }
    ]
  }
];

export default routes;
