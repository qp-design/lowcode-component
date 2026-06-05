import classNames from "classnames";
import { Dispatch } from "react";

const HeaderJsx = ({
  menu,
  setIndex,
  index,
}: {
  menu: Array<string>;
  setIndex: Dispatch<number>;
  index: number;
}) => {
  return (
    <div className={"header"}>
      {menu.map((item, ind) => (
        <span
          key={ind}
          onClick={() => setIndex(ind)}
          className={classNames({ actived: ind === index })}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default HeaderJsx;
