/**
 * Keep the root loading boundary non-blocking. The previous full-screen
 * client splash depended on hydration to dismiss itself, which could leave
 * the entire application covered indefinitely when client JS was delayed.
 */
export default function RootLoading() {
  return null
}
