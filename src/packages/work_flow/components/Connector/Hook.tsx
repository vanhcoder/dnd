import { EventHandler, MouseEventHandler } from "react";
import styles from "./hook.module.css";

function Hooks({ isConnected }: { isConnected: boolean }) {
  function onClick() {}
  return (
    <div className={styles.hookContainer}>
      <div className={styles.hook}>
        <div className={styles.circle} onClick={onClick}>
          +
        </div>
      </div>
    </div>
  );
}

export default Hooks;
