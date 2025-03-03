import { Link, useRouteError } from "react-router-dom";

type RouteError = {
  statusText?: string;
  message?: string;
};

const ErrorPage = () => {
  const error = useRouteError() as RouteError;

  return (
    <div className="flex flex-grow items-center justify-center pb-28 bg-teal-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="space-y-4 w-80 md:w-96 bg-white dark:bg-gray-800 shadow-md border-teal-100 dark:border-gray-700 p-6 rounded-lg text-center">
        <h1 className="text-2xl mb-4 font-bold text-red-600 dark:text-red-400">
          Oops!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Something went wrong.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error?.statusText || error?.message}
        </p>
        <Link
          to="/"
          className="p-3 inline-block font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 mt-2"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
