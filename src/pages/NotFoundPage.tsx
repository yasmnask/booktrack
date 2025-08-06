interface NotFoundPageProps {
  isDarkMode: boolean;
}

const NotFoundPage = ({ isDarkMode }: NotFoundPageProps) => {
  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p
        className={`text-lg mb-6 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFoundPage;
