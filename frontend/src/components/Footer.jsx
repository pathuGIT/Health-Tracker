const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-12">
            <p>© {new Date().getFullYear()} FitTrack Pro. All rights reserved.</p>
            <p className="text-sm mt-2">Built with ❤️ using React & Tailwind</p>
        </footer>
    );
};

export default Footer;
