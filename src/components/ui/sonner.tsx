import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Use system preference or default to dark theme
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: theme === 'dark' 
            ? "group toast group-[.toaster]:bg-[#23263a] group-[.toaster]:text-white group-[.toaster]:border-gray-700 group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm"
            : "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm",
          description: theme === 'dark'
            ? "group-[.toast]:text-slate-300"
            : "group-[.toast]:text-slate-600",
          actionButton: theme === 'dark'
            ? "group-[.toast]:bg-[#7c3aed] group-[.toast]:text-white hover:group-[.toast]:bg-[#6d28d9] group-[.toast]:border-[#7c3aed]"
            : "group-[.toast]:bg-[#7c3aed] group-[.toast]:text-white hover:group-[.toast]:bg-[#6d28d9] group-[.toast]:border-[#7c3aed]",
          cancelButton: theme === 'dark'
            ? "group-[.toast]:bg-slate-700 group-[.toast]:text-slate-300 hover:group-[.toast]:bg-slate-600 group-[.toast]:border-slate-600"
            : "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-700 hover:group-[.toast]:bg-slate-200 group-[.toast]:border-slate-300",
          closeButton: theme === 'dark'
            ? "group-[.toast]:text-slate-400 hover:group-[.toast]:text-white hover:group-[.toast]:bg-slate-700"
            : "group-[.toast]:text-slate-500 hover:group-[.toast]:text-slate-700 hover:group-[.toast]:bg-slate-100",
          success: theme === 'dark'
            ? "group-[.toast]:bg-green-900/20 group-[.toast]:border-green-700 group-[.toast]:text-green-100"
            : "group-[.toast]:bg-green-50 group-[.toast]:border-green-200 group-[.toast]:text-green-800",
          error: theme === 'dark'
            ? "group-[.toast]:bg-red-900/20 group-[.toast]:border-red-700 group-[.toast]:text-red-100"
            : "group-[.toast]:bg-red-50 group-[.toast]:border-red-200 group-[.toast]:text-red-800",
          warning: theme === 'dark'
            ? "group-[.toast]:bg-yellow-900/20 group-[.toast]:border-yellow-700 group-[.toast]:text-yellow-100"
            : "group-[.toast]:bg-yellow-50 group-[.toast]:border-yellow-200 group-[.toast]:text-yellow-800",
          info: theme === 'dark'
            ? "group-[.toast]:bg-blue-900/20 group-[.toast]:border-blue-700 group-[.toast]:text-blue-100"
            : "group-[.toast]:bg-blue-50 group-[.toast]:border-blue-200 group-[.toast]:text-blue-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
