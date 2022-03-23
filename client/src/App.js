import HomePage from './components/homepage';
import LoginPage from './components/loginpage';
import ChangePassword from './components/changepassword';
import wellcomePage from './components/wellcome';
import ManageIotDevice from './components/manageIotDevice';
import AddDevice from './components/adddevice';
import ViewRoomList from './components/viewroomlist';
import ManageAccount from './components/manageAccount';

import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={HomePage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/forgot-password" exact component={ChangePassword} />
        <Route path="/wellcome" exact component={wellcomePage} />
        <Route path="/manage-view" exact component={ManageIotDevice} />
        <Route path="/add-device" exact component={AddDevice} />
        <Route path="/view-room-list" exact component={ViewRoomList} />
        <Route path="/manage-account" exact component={ManageAccount} />

      </Router>
    </div>
  );
}

export default App;
