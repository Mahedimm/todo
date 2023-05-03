import React from "react";

import Protected from "@components/layout/protected";
import Landing from "@containers";

const Home: React.FC = () => {
  return (
      <Protected>
        <Landing />
      </Protected>


  );
};

export default Home;
