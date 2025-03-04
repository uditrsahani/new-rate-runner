import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import instance from '../store/instance';
// import { authApi } from '../__fakeApi__/authApi';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

const AuthContext = createContext({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = JSON.parse(window.localStorage.getItem('user'));

        if (user.token) {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const user = await instance.post('/auth/login', { user_username: email, user_password: password });
    const page = {
      inquiryStatus: 0,
      recommend: 0,
      inquiry: 0,
      quotationDraft: 0,
      updateResult: 0,
      forecast: 0
    };
    localStorage.setItem('menupage', JSON.stringify(page));
    localStorage.setItem('user', JSON.stringify(user.data));

    dispatch({
      type: 'LOGIN',
      payload: {
        user: user.data
      }
    });
  };

  const logout = async () => {
    const user = JSON.parse(window.localStorage.getItem('user'));
    if (user.ad === 1) {
      // window.location.assign('https://login.microsoftonline.com/d5b5a12b-f20f-4738-a03b-36b2e344c23a/oauth2/logout?post_logout_redirect_uri=https%3A%2F%2Fraterunner.wicesupplychain.com&fbclid=IwAR2kZxygQO1IHMC5zv3Q-xrhavGxQoxNSKQkt0B3E-IDQKlUeQZDO5sY1yw');
      window.location.assign('https://login.microsoftonline.com/d5b5a12b-f20f-4738-a03b-36b2e344c23a/oauth2/logout?post_logout_redirect_uri=https%3A%2F%2Flocalhost:3000&fbclid=IwAR2kZxygQO1IHMC5zv3Q-xrhavGxQoxNSKQkt0B3E-IDQKlUeQZDO5sY1yw');
    }
    localStorage.removeItem('user');
    localStorage.removeItem('menupage');
    localStorage.removeItem('rateTable');
    localStorage.removeItem('rateTableL');
    localStorage.removeItem('city');
    localStorage.removeItem('cityL');
    localStorage.removeItem('port');
    localStorage.removeItem('portL');
    localStorage.removeItem('sales');
    localStorage.removeItem('salesL');
    localStorage.removeItem('agent');
    localStorage.removeItem('agentL');
    localStorage.removeItem('carrier');
    localStorage.removeItem('carrierL');
    localStorage.removeItem('customer');
    localStorage.removeItem('customerL');
    localStorage.removeItem('competitor');
    localStorage.removeItem('competitorL');
    localStorage.removeItem('calendar');
    localStorage.removeItem('calendarL');
    dispatch({ type: 'LOGOUT' });
  };

  /* const register = async (email, name, password) => {
    const accessToken = await authApi.register({ email, name, password });
    const user = await authApi.me(accessToken);

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  }; */

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
