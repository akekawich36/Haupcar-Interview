import { Link } from '@tanstack/react-router'

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="font-medium">Page not found</p>
      <p className="text-sm text-neutral-500">The page you are looking for does not exist.</p>
      <Link to="/" className="text-sm underline underline-offset-4">
        Back to home
      </Link>
    </div>
  )
}
