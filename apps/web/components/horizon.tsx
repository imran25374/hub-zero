/** The site's one decorative element: the warm horizon from the covers. */
export function Horizon({ dawn = false }: { dawn?: boolean }) {
  return <div aria-hidden className={dawn ? "horizon horizon-dawn" : "horizon"} />;
}
