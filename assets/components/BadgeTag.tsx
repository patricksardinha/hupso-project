import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";

const BadgeTag = (props: any) => {
  
  return (
    <span className="bg-[#079992] text-[#c1e5e4] text-sm font-medium me-2 px-2.5 py-1 rounded-lg">{props.tag}</span>
  );
}

export default BadgeTag