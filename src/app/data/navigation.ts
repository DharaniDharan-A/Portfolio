export interface NavItem {
  /** Element id of the section; also its component folder name. */
  id: string;
  label: string;
}

/** Page sections, in document order — the scroll-spy relies on the order. */
export const sections: readonly NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'contact', label: 'Contact' },
];
