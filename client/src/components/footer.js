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
               
            </div>
        )
    }
    else{
        return (
            <div className='footer'>
                
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