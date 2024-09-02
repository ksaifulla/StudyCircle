export default function Appbar() {
  return (
    <div className="w-full h-10 bg-gradient-to-r from-soft-500  to-zinc-900  ">
      <div className="px-3 py-1 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end"></div>
          <div className="flex items-center text-white antialiased font-bold font-xs pt-1 cursor-pointer">
          StudyCircle 
          </div>
        </div>
      </div>
    </div>
  );
}
