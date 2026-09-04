type LogoProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LogoDark(props: LogoProps) {
  return <img src="/brand/favicon-dark.svg" alt="" aria-hidden="true" {...props} />;
}

export function LogoLight(props: LogoProps) {
  return <img src="/brand/favicon-light.svg" alt="" aria-hidden="true" {...props} />;
}
