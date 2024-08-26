

import { Auth } from "../components/Auth";

export const Signup = () => {
  return (
  <div className="h-screen flex justify-center flex-col ">
      <div className="flex justify-center 	">
        <Auth type="signup" />
      </div>
    </div>
  );
};

export default Signup;