// React and React Admin imports
import { Admin, Resource } from 'react-admin';
import ReactDOM from 'react-dom/client';

// Local imports
import { authProvider } from './services/authProvider';
import { dataProvider } from './services/dataProvider';
import { theme } from './theme';
// Page components
import { Dashboard } from './pages/Dashboard';
import { JobList, JobEdit, JobCreate, JobShow } from './pages/Jobs';
import { UserList, UserEdit, UserCreate, UserShow } from './pages/Users';
import { ApplicationList, ApplicationEdit, ApplicationShow } from './pages/Applications';
import { Analytics } from './pages/Analytics';


const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    theme={theme}
    dashboard={Dashboard}
  >
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      create={UserCreate}
      show={UserShow}
    />
    <Resource
      name="jobs"
      list={JobList}
      edit={JobEdit}
      create={JobCreate}
      show={JobShow}
    />
    <Resource
      name="applications"
      list={ApplicationList}
      edit={ApplicationEdit}
      show={ApplicationShow}
    />
    <Resource
      name="analytics"
      list={Analytics}
    />
  </Admin>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
