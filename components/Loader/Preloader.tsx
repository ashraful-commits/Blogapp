import React from "react";
import { HashLoader } from "react-spinners";

const Preloader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <HashLoader color="#9333EA" size={80} />
    </div>
  );
};

export default Preloader;
