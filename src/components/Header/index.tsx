import type{ FC } from "react";

import styles from "./Header.module.scss";

const Header: FC = function HeaderComponent({ children }) {
  return <header className={styles.header}>{children}</header>;
};

export default Header;
