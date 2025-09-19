import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <h1 className="text-2xl font-bold">FitTrack Pro</h1>
                <nav className="space-x-6">
                    <Link to="/" className="hover:text-gray-200">Home</Link>
                    <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
                    <Link to="/users" className="hover:text-gray-200">Users</Link>
                    <Link to="/exercises" className="hover:text-gray-200">Exercises</Link>
                    <Link to="/meals" className="hover:text-gray-200">Meals</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
