export type NavPage = 'home' | 'calendar' | 'stats' | 'profile';

export function getActiveNavPage(pathname: string): NavPage {
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/stats')) return 'stats';
  if (pathname.startsWith('/workout-plans')) return 'calendar';
  return 'home';
}
