import { Outlet } from 'react-router-dom'
import HeroNavbar from './component/HeroNavbar'


function MainPage({ isAuthenticated }: { isAuthenticated: boolean }) {
    return (
        <>

            <HeroNavbar isAuthenticated={isAuthenticated} />
            <Outlet />

        </>

    )
}

export default MainPage