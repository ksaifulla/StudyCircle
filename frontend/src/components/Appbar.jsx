export default function Appbar() {
  return (
    <div className="z-50 w-full h-10 border-rose-200 dark:bg-rose-900 dark:border-rose-400  ">
      <div className="px-3 py-1 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end"></div>
          <div className="flex items-center">
            <div
              className="flex text-sm bg-rose-500 rounded-full focus:ring-4 focus:ring-rose-300 dark:focus:ring-rose-600"
              aria-expanded="false"
              data-dropdown-toggle="dropdown-user"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="https://i.pinimg.com/originals/bd/81/2f/bd812f126161722bae4f2a29436d9ce3.jpg"
                alt="user photo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
