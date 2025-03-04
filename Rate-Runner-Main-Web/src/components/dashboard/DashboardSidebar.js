import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';
import sectionsSales from './dataSide/SidebarSales';
import sectionsSalesManager from './dataSide/SidebarSalesManager';
import sectionsMarketing from './dataSide/SidebarMkgt';
import sectionsMarketingManager from './dataSide/SidebarMkgtManager';
import sectionsManagemant from './dataSide/SidebarManagement';
import sectionSeniorsManagemant from './dataSide/SidebarSeniorManagement';
import sectionsSystmAdmin from './dataSide/SidebarSystemAdmin';
import sectionsDataAdmin from './dataSide/SidebarDataAdmin';
import useAuth from '../../hooks/useAuth';

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const { user } = useAuth();
  const usertype = user.user_role;
  // const menupage = JSON.parse(window.localStorage.getItem('menupage'));

  let renderside = sectionsSales;
  if (usertype === 'salesManager') {
    renderside = sectionsSalesManager;
  } else if (usertype === 'marketing') {
    renderside = sectionsMarketing;
  } else if (usertype === 'marketingManager') {
    renderside = sectionsMarketingManager;
  } else if (usertype === 'management') {
    renderside = sectionsManagemant;
  } else if (usertype === 'seniorManager') {
    renderside = sectionSeniorsManagemant;
  } else if (usertype === 'systemAdmin') {
    renderside = sectionsSystmAdmin;
  } else if (usertype === 'dataAdmin') {
    renderside = sectionsDataAdmin;
  }

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
            justifyContent: 'center',
            p: 2
          }}
        >
          <RouterLink to="/">
            <Logo
              sx={{
                height: 40,
                width: 40
              }}
            />
          </RouterLink>
        </Box>
        <Box sx={{ p: 2 }}>
          {renderside.map((section) => {
            const path = location.pathname.split('/');
            let sendpath = '';
            if (path[2] === '') {
              if (user.user_role === 'systemAdmin') {
                sendpath = '/reference-data/user';
              } if (user.user_role === 'dataAdmin') {
                sendpath = '/report/booking';
              } if (user.user_role !== 'systemAdmin' && user.user_role !== 'dataAdmin') {
                sendpath = '/main/inquiry-status';
              }
            } else {
              sendpath = `/${path[1]}/${path[2]}`;
            }

            return (
              <NavSection
                key={section.title}
                pathname={sendpath}
                onClick={() => {
                  /* let page = '';
                console.log(menupage);
                if (window.location.pathname === '/main/inquiry-status') {
                  console.log('/main/inquiry-status');
                  page = {
                    inquiryStatus: 0,
                    recommend: menupage.recommend,
                    inquiry: menupage.inquiry,
                    quotationDraft: menupage.quotationDraft,
                    updateResult: menupage.updateResult,
                    forecast: menupage.forecast
                  };
                } else if (window.location.pathname === '/main/recommend') {
                  // console.log('/main/recommend');
                  page = {
                    inquiryStatus: menupage.inquiryStatus,
                    recommend: 0,
                    inquiry: menupage.inquiry,
                    quotationDraft: menupage.quotationDraft,
                    updateResult: menupage.updateResult,
                    forecast: menupage.forecast
                  };
                  console.log(page);
                } else if (window.location.pathname === '/main/inquiry') {
                  // console.log('/main/inquiry');
                  page = {
                    inquiryStatus: menupage.inquiryStatus,
                    recommend: menupage.recommend,
                    inquiry: 0,
                    quotationDraft: menupage.quotationDraft,
                    updateResult: menupage.updateResult,
                    forecast: menupage.forecast
                  };
                } else if (window.location.pathname === '/main/quotation-draft') {
                  // console.log('/main/quotation-draft');
                  page = {
                    inquiryStatus: menupage.inquiryStatus,
                    recommend: menupage.recommend,
                    inquiry: menupage.inquiry,
                    quotationDraft: 0,
                    updateResult: menupage.updateResult,
                    forecast: menupage.forecast
                  };
                } else if (window.location.pathname === '/main/update-result') {
                  // console.log('/main/update-result');
                  page = {
                    inquiryStatus: menupage.inquiryStatus,
                    recommend: menupage.recommend,
                    inquiry: menupage.inquiry,
                    quotationDraft: menupage.quotationDraft,
                    updateResult: 0,
                    forecast: menupage.forecast
                  };
                } else if (window.location.pathname === '/main/forecast') {
                  // console.log('/main/forecast');
                  page = {
                    inquiryStatus: menupage.inquiryStatus,
                    recommend: menupage.recommend,
                    inquiry: menupage.inquiry,
                    quotationDraft: menupage.quotationDraft,
                    updateResult: menupage.updateResult,
                    forecast: 0
                  };
                } else {
                  page = {
                    inquiryStatus: menupage.inquiryStatus,
                    recommend: menupage.recommend,
                    inquiry: menupage.inquiry,
                    quotationDraft: menupage.quotationDraft,
                    updateResult: menupage.updateResult,
                    forecast: menupage.forecast
                  };
                }
                localStorage.setItem('menupage', JSON.stringify(page)); */
                }}
                sx={{
                  '& + &': {
                    mt: 3
                  },
                  '& img': {
                    height: 'auto',
                    width: '30px'
                  }
                }}
                {...section}
              />
            );
          })}
        </Box>
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 260,
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 260
        }
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default DashboardSidebar;
