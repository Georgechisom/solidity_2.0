import React from "react";
import UseChairPerson from "../../hooks/UseChairPerson";

const MainLayout = () => {
  const balance = UseChairPerson();

  return (
    <div className="">
      <p className="mt-5"> Hello</p>
      <div className="flex flex-row  ml-auto items-center my-4">
        <div className="">Contract Address:</div>
        <div className="text-blue-700 text-xl font-bold">{balance.balance}</div>
      </div>
    </div>
  );
};

export default MainLayout;
