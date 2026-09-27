import { IconName } from '../../shared/icon.component';

export interface Command {
  id: string;
  label: string;
  group: 'Go to' | 'Contact' | 'Action';
  icon: IconName;
  /** Extra words to match when filtering. */
  keywords?: string;
  run: () => void;
}

/**
 * Case-insensitive filter: every whitespace-separated term must appear in the
 * command's label, group or keywords. Label-prefix matches rank first.
 */
export function filterCommands(commands: Command[], query: string): Command[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return commands;

  return commands
    .filter((command) => {
      const haystack = `${command.label} ${command.group} ${command.keywords ?? ''}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .sort(
      (a, b) =>
        Number(b.label.toLowerCase().startsWith(terms[0])) -
        Number(a.label.toLowerCase().startsWith(terms[0])),
    );
}
