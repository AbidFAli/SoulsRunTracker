import Link from "next/link";
import React from "react";
import classNames from "classnames";
import styles from './styles.module.scss'

interface LinkNoStyleProps extends React.ComponentProps<typeof Link>{
  color?: string;
};


export function LinkNoStyle(props: LinkNoStyleProps){
  return <Link {...props} className={classNames(props.className ?? '', styles['link-no-style'])} />
}