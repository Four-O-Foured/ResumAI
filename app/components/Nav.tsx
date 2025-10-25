import { Link } from "react-router"
const Nav = () => {
  return (
    <nav className="navbar">
        <Link to='/'>
        <p className="text-xl font-bold text-gradient">RESUMAI</p>

        </Link>

        <Link to='/upload' className="primary-button w-fit">Upload Resume</Link>
    </nav>
  )
}

export default Nav