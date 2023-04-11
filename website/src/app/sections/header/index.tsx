import Link from "next/link";

import s from "./header.module.scss";
import { LogoBasement } from "./visuals/logo";
import { IconStar } from "./visuals/star";

export const Header = () => {
  return (
    <header className={s["header"]}>
      <Link href="/">
        <LogoBasement className={s["logo"]} />
      </Link>
      <IconStar className={s["star"]} />
      <p>I got the whole band set up in the basement & we are jamming.</p>
    </header>
  );
};
