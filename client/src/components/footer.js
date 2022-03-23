import { Link } from 'react-router-dom'
import '../css/footer.css'
function Footer({isAdmin}) {
    if(isAdmin === 0)
    {
        return (
            <div className='footer'>
                <div className='power-part'>
                    <img src="../img/power.png" alt="power" className='power' />
                </div>
                <div className='center-part'>
    
                </div>
                <Link to='map-view' className='map-view-part logo-click'>
                    <div className="map-view">
                        
                        <div className='nav-border'>
                        <p>Map view</p>
                        </div>
                        <img className="nav1" src="../img/nav.png" alt="nav" />
                    </div>
                </Link>
            </div>
        )
    }
    else{
        return (
            <div className='footer'>
                <Link to='manage-account' className='map-view-part logo-click'>
                    <div className="map-view">
                        <img className="nav2" src="../img/nav.png" alt="nav" />
                        <div className='nav-border'>
                        <p>Manage Account</p>
                        </div>
                    </div>
                </Link>
                <div className='center-part'>
    
                </div>
                <div className='power-part'>
                    <img src="../img/power.png" alt="power" className='power' />
                </div>
            </div>
        )
    }

}
export default Footer;