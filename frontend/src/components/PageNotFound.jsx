export default function PageNotFound() {
  return (
    <div className="bg-gray-900 h-screen">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-primary-500 mb-4 text-7xl font-extrabold tracking-tight text-fuchsia-900 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight  md:text-4xl text-white">
            Oops! That page can’t be found
          </p>
          <p className="mb-4 text-lg font-light text-gray-400">
            The page you are looking for it maybe deleted
          </p>
        </div>
      </div>
    </div>
  );
}
