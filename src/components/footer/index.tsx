function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 text-xs text-zinc-600">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        Erisco Blog &copy; {new Date().getFullYear()}
      </div>
    </footer>
  )
}

export default Footer
