const settingsCategories = [
  { id: "profile", name: "Profile" },
  { id: "notifications", name: "Notifications" },
  { id: "privacy", name: "Privacy" },
  { id: "subscriptions", name: "Subscriptions" },
];

const SettingsSidebar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-80 bg-gray-900 h-full p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mr-20 mb-4 text-soft-100">Settings</h2>
      <ul className="w-full">
        {settingsCategories.map((category) => (
          <li
            key={category.id}
            className={`relative cursor-pointer py-2 text-lg font-bold rounded-none flex items-center ${
              selectedCategory === category.id
                ? "text-fuchsia-500"
                : "text-gray-400 hover:text-fuchsia-500"
            } mb-4`}
            onClick={() => onSelectCategory(category.id)}
          >
            {selectedCategory === category.id && (
              <div
                className="absolute left-0 top-0 h-full border-l-4 border-fuchsia-500"
                style={{ width: "4px" }}
              ></div>
            )}
            <span className="ml-4">{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsSidebar;
