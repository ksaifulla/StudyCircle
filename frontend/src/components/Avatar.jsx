const GroupAvatar = ({ name }) => {
  return (
    <div
      className=" relative flex items-center justify-center h-7 w-7 mt-2 mb-2 mx-auto
    bg-rose-400 hover:bg-green-600 dark:bg-rose-800 text-green-500 hover:text-white 
    hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg  group"
    >
      <span className="text-xs text-red-600 dark:text-red-300">{name[0]}</span>
    </div>
  );
};

export default GroupAvatar;
